import { ChatOpenAI } from '@langchain/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

export class AIService {
  private static chatModel: any;
  private static geminiClient: GoogleGenerativeAI | null = null;

  private static formatInterviewQuestions(raw: string) {
    const cleaned = raw.replace(/```json|```/g, '').replace(/\r\n/g, '\n').trim();

    // If the model accidentally emitted a numbered heading like "3. ## 简历项目深挖",
    // normalize it to a plain heading line so our splitter can detect it.
    const normalizedHeadings = cleaned.replace(/^\s*\d+\.\s*##\s*/gm, '## ');

    // If the whole output is JSON or contains a JSON block, try to parse and format it.
    const tryParseJson = (text: string) => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    };

    const direct = tryParseJson(normalizedHeadings);
    if (direct) {
      const toNumberedList = (items: unknown[]) =>
        items.map((item, index) => `${index + 1}. ${String(item).trim()}`).join('\n\n');

      if (Array.isArray(direct)) return toNumberedList(direct as unknown[]);
      if (Array.isArray((direct as any).questions)) return toNumberedList((direct as any).questions);
    }

    const jsonMatch = normalizedHeadings.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = tryParseJson(jsonMatch[0]);
      if (parsed) {
        const toNumberedList = (items: unknown[]) =>
          items.map((item, index) => `${index + 1}. ${String(item).trim()}`).join('\n\n');
        if (Array.isArray(parsed)) return toNumberedList(parsed as unknown[]);
        if (Array.isArray((parsed as any).questions)) return toNumberedList((parsed as any).questions);
      }
    }

    // Split into sections by '## ' headings. Keep heading with its block.
    const sections = normalizedHeadings.split(/(?=^##\s+)/m).map((s) => s.trim()).filter(Boolean);

    const processedSections = sections.map((section) => {
      // Extract title
      const titleMatch = section.match(/^##\s*(.+)/);
      if (!titleMatch) {
        // fallback: treat whole section as one unnamed block
        const paras = section
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => p.replace(/^\d+[.)]\s*/, '').replace(/^[-*]\s*/, '').trim());
        return paras.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
      }

      const title = titleMatch[1].trim();
      // Remove the heading line from content
      const content = section.replace(/^##.*\n?/, '').trim();

      // Remove hint lines (like "💡 小提示") from being treated as questions,
      // but keep them as a short note line under the heading if present.
      const lines = content.split('\n');
      const noteLines: string[] = [];
      const questionAnswerPairs: Array<{q: string; a?: string}> = [];
      let currentQuestion: string | null = null;
      let currentAnswer: string[] = [];
      let blankLineCount = 0;

      const flushCurrentQuestion = () => {
        if (currentQuestion) {
          questionAnswerPairs.push({
            q: currentQuestion,
            a: currentAnswer.length > 0 ? currentAnswer.join('\n').trim() : undefined,
          });
          currentQuestion = null;
          currentAnswer = [];
          blankLineCount = 0;
        }
      };

      for (let rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
          blankLineCount++;
          if (currentQuestion) currentAnswer.push('');
          continue;
        }
        blankLineCount = 0;

        // Detect hint lines
        if (/小提示|提示|💡/.test(line)) {
          flushCurrentQuestion();
          noteLines.push(line.replace(/^💡\s*/, '提示:').trim());
          continue;
        }

        // Only detect a new question if:
        // 1. We don't have a current question yet, OR
        // 2. We just had 2+ blank lines (indicating end of previous answer block)
        if (!currentQuestion && /^\d+[.)]\s*/.test(line)) {
          // Start of a new question
          currentQuestion = line.replace(/^\d+[.)]\s*/, '').trim();
        } else if (currentQuestion) {
          // We're in the middle of a question's answer
          currentAnswer.push(line);
        } else {
          // No current question, and this line doesn't match new question pattern
          // Start a new implicit question with this line
          currentQuestion = line;
        }
      }
      flushCurrentQuestion();

      let sectionText = `## ${title}\n\n`;
      if (noteLines.length) sectionText += noteLines.join(' ') + '\n\n';
      
      if (questionAnswerPairs.length > 0) {
        const formatted = questionAnswerPairs
          .map((pair, idx) => {
            let text = `${idx + 1}. ${pair.q}`;
            if (pair.a) {
              text += `\n${pair.a}`;
            }
            return text;
          })
          .join('\n\n');
        sectionText += formatted;
      } else if (content) {
        sectionText += content + '\n';
      }

      return sectionText.trim();
    });

    const result = processedSections.join('\n\n');
    return result || normalizedHeadings;
  }

  /**
   * 初始化AI模型
   */
  static initialize() {
    if (!this.chatModel) {
      if (config.ai.provider === 'gemini') {
        this.geminiClient = new GoogleGenerativeAI(config.ai.geminiApiKey);
        // Use gemini-2.5-flash-lite for better quota and performance
        this.chatModel = this.geminiClient.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      } else {
        this.chatModel = new ChatOpenAI({
          modelName: 'gpt-3.5-turbo',
          temperature: 0.7,
          apiKey: config.ai.openaiApiKey,
        });
      }
    }
    return this.chatModel;
  }

  static async invoke(prompt: string) {
    const model = this.initialize();

    if (config.ai.provider === 'gemini') {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    const response = await model.invoke(prompt);
    return response.content;
  }

  /**
   * 根据职位生成面试问题
   */
  static async generateInterviewQuestions(
    position: string,
    company?: string,
    resumeContent?: string,
    searchContext?: string
  ) {
    this.initialize();
    
    const resumePart = resumeContent ? `
    参考求职者简历内容：\n${resumeContent}\n` : '';
    const companyPart = company ? `
    公司名称：${company}
    请尽量结合该公司的公开面试风格、业务特点、岗位常见考察重点来出题。`
      : '';

    const prompt = `
    你是一个专业的面试官，熟悉中国互联网大厂（字节跳动、阿里、腾讯、百度等）的技术面试风格。请根据以下职位信息生成 20 个面试问题及答案。
    
    职位：${position}
    ${companyPart}
    ${resumePart}
    ${searchContext ? `
    真实搜索到的公开面经/面试题参考：
    ${searchContext}
    ` : ''}
    
    输出要求：
    1. 只输出纯文本，不要输出 JSON、代码块、前言或解释。
    2. 问题必须与职位需求高度相关。分析岗位类型后，选择最相关的问题类别。例如：
       - 数据开发工程师：关注数据仓库、ETL、SQL优化、数据模型设计等
       - 后端工程师：关注系统架构、分布式系统、数据库、缓存、消息队列等
       - 前端工程师：关注React/Vue框架、性能优化、浏览器原理等
       - 算法工程师：关注算法设计、数据结构、方案优化等
    3. 按以下类别分组（根据职位选择最相关的3-4个类别）：自我介绍、简历项目深挖、职位相关技术问题、问题解决能力、公司/岗位风格题。
    4. 每个类别使用二级标题，例如"## 自我介绍"。
    5. 每个类别下的问题和答案必须编号，例如"1. xxx"、"2. xxx"，每个类别从1开始编号。答案不需要另外编号。
    6. 同一类别下的问题之间空一行。
    7. 总题数保持 20 题左右，各类别可灵活分配。
    8. 答案部分要简洁明了，突出关键点，不要过于冗长。
    9. 最后一定要提供反问问题，模拟真实面试场景。
    `;

    try {
      const content = await this.invoke(prompt);
      return this.formatInterviewQuestions(String(content));
    } catch (error) {
      console.error('Failed to generate questions:', error);
      throw error;
    }
  }

  /**
   * 生成面试反馈
   */
  static async generateFeedback(question: string, answer: string) {
    this.initialize();
    
    const prompt = `
    你是一个专业的面试官。根据以下问题和回答提供反馈。
    
    问题：${question}
    回答：${answer}
    
    请提供：
    1. 回答的优点
    2. 需要改进的地方
    3. 改进建议
    4. 评分（1-10分）
    `;

    try {
      return await this.invoke(prompt);
    } catch (error) {
      console.error('Failed to generate feedback:', error);
      throw error;
    }
  }

  /**
   * 优化简历内容
   */
  static async optimizeResume(resumeContent: string, targetPosition?: string) {
    this.initialize();
    
    const prompt = `
    你是一位资深职业顾问和简历优化专家，拥有10年以上人力资源和招聘经验。你精通各行业招聘标准，擅长简历关键词优化和ATS系统适配，能够准确评估求职者与目标岗位的匹配度。
    ${targetPosition ? `目标职位：${targetPosition}` : ''}
    
    简历内容：
    ${resumeContent}
    
    # 任务 (Task)
    基于提供的目标职位名称和求职者简历，进行专业的岗位匹配度评估并提供简历优化方案。注意：只输出纯文本，不要输出 JSON、代码块、前言或解释。
    ## 核心要求 (Core Requirements)
    ### 1. 岗位匹配度分析
    - **深度解析**：仔细查找并分析岗位名称中的关键信息
    - 核心职责和工作内容
    - 必备技能和资格要求
    - 优先考虑的加分项
    - 行业背景和经验要求
    ​
    ### 2. 简历与岗位差距识别
    - **系统性评估**：对比求职者背景与岗位要求
    - 技能匹配度（技术技能、软技能）
    - 经验相关性（工作年限、行业经验、项目经验）
    - 教育背景符合度
    - 证书资质匹配情况
    ​
    ### 3. 简历优化执行
    - **关键词整合**：将招聘信息中的核心关键词自然融入简历
    - **内容重组**：突出与目标岗位最相关的经验和成就
    - **格式优化**：确保简历严格控制在一页内，布局清晰专业
    ​
    ## 实现细节 (Implementation Details)
    ​
    ### 阶段一：匹配度评估 (5分钟)
    1. 提取招聘信息关键要素
    2. 分析求职者现有优势
    3. 识别能力差距和改进空间
    4. 给出匹配度评分（1-10分）
    ​
    ### 阶段二：差距分析报告 (10分钟)
    1. **强项分析**：列出3-5个核心优势
    2. **差距识别**：指出2-3个主要不足
    3. **改进建议**：提供具体的能力提升方案
    ​
    ### 阶段三：简历优化 (15分钟)
    1. **关键词融入**：自然嵌入岗位相关术语
    2. **内容调整**：重新排列和强化相关经验
    3. **量化成果**：用数据突出工作成效
    4. **格式控制**：严格保证一页篇幅
    5. **项目案例**：按照招聘要求，帮我写1个相关的案例，和公司要求最佳匹配。
    ​
    # 格式 (Format)
    ​
    ## 输出结构
    ​
    ### 第一部分：岗位匹配度评估
    岗位匹配度分析
    匹配度评分：X/10分
    核心优势 ✅
    [优势1：具体说明]
    [优势2：具体说明]
    [优势3：具体说明]
    主要差距 ⚠️
    [差距1：具体描述 + 改进建议]
    [差距2：具体描述 + 改进建议]
    竞争力评估  
    技能匹配度：X/10
    经验相关性：X/10
    综合适配度：X/10
    ​
    ### 第二部分：简历优化方案
    简历优化建议
    需要强化的关键词
    [关键词1]、[关键词2]、[关键词3]
    内容调整重点
    工作经验部分：[具体调整建议]
    技能展示部分：[具体调整建议]
    项目经验部分：[具体调整建议]
    量化指标建议
    [建议添加的具体数据和成果]

    ### 第三部分：优化后简历
    优化后简历（一页版本）
    [提供完整的、格式化的一页简历内容]

    ## 质量标准
    - ✅ 匹配度评估客观准确
    - ✅ 差距分析具体可行
    - ✅ 关键词融入自然流畅
    - ✅ 简历篇幅严格控制在一页
    - ✅ 建议具备可操作性

    `;

    try {
      return await this.invoke(prompt);
    } catch (error) {
      console.error('Failed to optimize resume:', error);
      throw error;
    }
  }

  /**
   * 生成职业规划建议
   */
  static async generateCareerPlan(
    currentRole: string,
    targetRole: string,
    currentSkills: string[]
  ) {
    this.initialize();
    
    const prompt = `
    你是一个职业顾问。基于以下信息提供职业发展建议。
    
    当前职位：${currentRole}
    目标职位：${targetRole}
    现有技能：${currentSkills.join(', ')}
    
    请提供：
    1. 职业发展路径
    2. 需要学习的技能清单
    3. 预计时间表
    4. 建议的行动步骤
    5. 相关资源推荐
    `;

    try {
      return await this.invoke(prompt);
    } catch (error) {
      console.error('Failed to generate career plan:', error);
      throw error;
    }
  }
}
