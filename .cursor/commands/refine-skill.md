---
name: /refine-skill
id: refine-skill
category: Skill Development
description: Interactively refine a Cursor skill through exhaustive questioning about requirements, use cases, examples, best practices, and supporting resources until every detail is crystal clear before any implementation.
---

**Purpose**
Refine a generated Cursor skill through comprehensive, verbose questioning that covers every aspect of the skill. This command follows Agent Skills best practices and ensures zero ambiguity before any code or content is written. Continue questioning until 100% clarity is achieved.

**Critical Rule: NO BUILDING UNTIL 100% CLEAR**
- Do NOT write code, create files, or generate content until ALL questions are answered
- Do NOT proceed to implementation until the user explicitly confirms all details are clear
- If ANY ambiguity remains, ask follow-up questions
- Present a complete summary and get approval before writing anything

**Guardrails**
- Ask ONE question at a time - wait for the user's response before proceeding
- Always require concrete examples - never accept vague descriptions
- If an answer is ambiguous, ask multiple follow-up questions until crystal clear
- Be verbose - ask detailed, comprehensive questions covering all aspects
- Proactively suggest best practices and supporting resources (scripts, references, assets)
- Update understanding incrementally but DO NOT write files until final approval
- Continue until you have zero remaining questions and user confirms readiness

**Process**

1. **Initial Assessment**
   - Locate the SKILL.md file in the current directory or ask which skill to refine
   - If multiple skills exist, list them and ask which one to refine
   - Read the current SKILL.md to understand what's already there
   - Identify all placeholders and areas needing clarification
   - "I found your skill at [path]. I see [X] placeholders and [Y] sections that need details. Let's go through everything systematically."

2. **Comprehensive Question Loop** - Ask these questions in order, requiring detailed examples:

   **A. Core Purpose & Identity**
   
   Q1: "What is the exact purpose of this skill? Describe in detail what problem it solves or what capability it provides. Give me a concrete, real-world example of when someone would need this."
   
   Q2: "What is the primary use case? Walk me through a complete scenario from start to finish - what triggers the need, what happens, what's the outcome?"
   
   Q3: "Are there secondary use cases? List each one and provide a concrete example for each."
   
   Q4: "What makes this skill unique? What distinguishes it from similar capabilities? Give examples of what it does that alternatives don't."
   
   Q5: "Who is the intended user? Is this for developers, end-users, specific roles? Provide examples of who would use this and in what context."

   **B. Discovery & Activation (Progressive Disclosure)**
   
   Q6: "What keywords or phrases should trigger an agent to consider this skill? List specific terms, phrases, or patterns that indicate this skill is relevant. Give examples of user requests that should activate this skill."
   
   Q7: "What keywords should be in the description field for optimal discovery? The description is loaded at startup for all skills - what words will help agents quickly identify when this skill is relevant?"
   
   Q8: "What are 3-5 concrete scenarios where an agent should activate this skill? For each scenario, provide: (1) the exact user request or context, (2) why this skill is appropriate, (3) what the agent should do."
   
   Q9: "When should an agent NOT use this skill? Give specific examples of requests or contexts where this skill would be inappropriate or insufficient."
   
   Q10: "What are the boundaries of this skill? What's in scope and what's out of scope? Provide concrete examples of both."

   **C. Instructions & Workflow**
   
   Q11: "What are the step-by-step instructions? Walk me through the complete process from activation to completion. For each step, tell me: (1) what to do, (2) what tools or resources to use, (3) what to check or validate, (4) what the expected outcome is."
   
   Q12: "Are there decision points or conditional logic? If yes, describe each decision point: (1) what condition is checked, (2) what happens in each branch, (3) provide examples of each path."
   
   Q13: "What are the prerequisites or setup requirements? List everything needed before this skill can be used: (1) tools, (2) libraries, (3) configuration, (4) data, (5) permissions. Give specific examples of each."
   
   Q14: "What tools, APIs, or external services does this skill require? For each: (1) what it is, (2) why it's needed, (3) how it's used, (4) any configuration required, (5) examples of usage."
   
   Q15: "Are there any dependencies between steps? Do later steps depend on outputs from earlier steps? Describe the data flow with examples."

   **D. Examples & Scenarios**
   
   Q16: "Provide 3-5 complete, end-to-end examples. For each example include: (1) the user's exact request or context, (2) step-by-step what the agent should do, (3) all inputs required, (4) all outputs produced, (5) the final result. Make these realistic and detailed."
   
   Q17: "What are common variations of the main use case? Provide examples of how the same skill might be used differently in similar but distinct scenarios."
   
   Q18: "What does a successful execution look like? Describe in detail: (1) what indicates success, (2) what the output format is, (3) provide a concrete example of a successful outcome with actual data."
   
   Q19: "What does partial success look like? Are there cases where the skill completes but with limitations? Give examples."

   **E. Error Handling & Edge Cases**
   
   Q20: "What can go wrong? List all possible failure modes: (1) invalid inputs, (2) missing resources, (3) external service failures, (4) permission issues, (5) data format problems. For each, provide a concrete example."
   
   Q21: "How should each error be handled? For each failure mode from Q20: (1) how to detect it, (2) what error message to show, (3) what the agent should do next, (4) whether to retry, (5) provide example error scenarios and responses."
   
   Q22: "What are the edge cases? List unusual but valid scenarios: (1) boundary conditions, (2) special input formats, (3) unusual but valid requests, (4) provide examples of each."
   
   Q23: "How should edge cases be handled? For each edge case: (1) how to recognize it, (2) how to handle it, (3) what adjustments to make, (4) provide examples."
   
   Q24: "What are the limitations? What can this skill NOT do? Provide specific examples of requests that are out of scope or impossible, and explain why."

   **F. Output & Results**
   
   Q25: "What is the output format? Describe in detail: (1) the structure, (2) the data types, (3) any formatting requirements, (4) provide 2-3 concrete examples of different output formats."
   
   Q26: "Are there multiple output formats? If yes, when is each used? Provide examples."
   
   Q27: "What metadata or context should be included with outputs? Should outputs include: (1) source information, (2) timestamps, (3) confidence levels, (4) warnings, (5) provide examples."
   
   Q28: "How should outputs be presented to users? Should they be: (1) formatted text, (2) structured data, (3) files, (4) visualizations? Provide examples of each format."

   **G. Best Practices & Optimization**
   
   Q29: "How can this skill use progressive disclosure effectively? The description should be concise for discovery, but SKILL.md can be detailed. What goes in description vs. body? Provide examples."
   
   Q30: "What information should be in referenced files vs. main SKILL.md? Should we create reference files for: (1) detailed technical docs, (2) form templates, (3) domain-specific info? Explain what should be in references/ and why."
   
   Q31: "Are there performance considerations? Are there: (1) expensive operations to avoid, (2) caching opportunities, (3) batch processing options, (4) provide examples of optimization strategies."

   **H. Supporting Resources (Scripts, References, Assets)**
   
   Q32: "Does this skill need executable scripts? Consider: (1) data processing scripts, (2) API wrappers, (3) utility functions, (4) validation scripts. For each potential script: (a) what it does, (b) what language, (c) what inputs/outputs, (d) provide examples. Should we create a scripts/ directory?"
   
   Q33: "Does this skill need reference documentation? Consider: (1) technical reference guides, (2) API documentation, (3) form templates, (4) domain-specific knowledge bases. For each: (a) what it contains, (b) why it's separate from SKILL.md, (c) provide examples. Should we create a references/ directory?"
   
   Q34: "Does this skill need assets? Consider: (1) template files, (2) configuration examples, (3) sample data, (4) diagrams or images, (5) lookup tables. For each: (a) what it is, (b) how it's used, (c) provide examples. Should we create an assets/ directory?"
   
   Q35: "If we create scripts/references/assets, what are the file naming conventions? What languages/formats? Provide specific examples of file names and their purposes."

   **I. Compatibility & Metadata**
   
   Q36: "Are there compatibility requirements? Does this skill require: (1) specific system packages, (2) network access, (3) specific environments, (4) minimum versions? List everything with examples."
   
   Q37: "Should we include optional metadata? Consider: (1) license information, (2) author/version, (3) compatibility notes. What should be included and why?"
   
   Q38: "Are there allowed-tools restrictions? Should this skill be limited to specific tools? If yes, which ones and why? Provide examples of tool usage."

   **J. Validation & Testing**
   
   Q39: "How can we validate this skill works correctly? What are: (1) test scenarios, (2) validation criteria, (3) success metrics, (4) provide concrete test cases with expected results."
   
   Q40: "What would indicate this skill is well-written? What are the quality criteria? Provide examples of good vs. poor skill documentation."

3. **Proactive Best Practice Suggestions**

   After gathering answers, proactively suggest:
   
   - "Based on your answers, I suggest creating a scripts/ directory because [reason]. Should we include [specific scripts]?"
   - "Your skill involves [domain], so a references/ directory with [specific docs] would be helpful. Should we create that?"
   - "For better progressive disclosure, I recommend moving [detailed content] to references/REFERENCE.md. Do you agree?"
   - "The description should emphasize [keywords] for better discovery. Should I update it to: '[suggested description]'?"
   - "This skill has complex error handling - should we document it in references/ERROR_HANDLING.md?"

4. **Comprehensive Validation Checklist**

   Before finalizing, verify ALL of the following (ask about any missing items):
   
   - [ ] Purpose is crystal clear with concrete examples
   - [ ] Description field has optimal keywords for discovery
   - [ ] "When to use this skill" has 3-5 concrete scenarios with examples
   - [ ] Step-by-step instructions are complete with examples for each step
   - [ ] All decision points and conditional logic are documented
   - [ ] Prerequisites and setup requirements are fully listed
   - [ ] All tools, APIs, and dependencies are documented with examples
   - [ ] At least 3-5 complete end-to-end examples with inputs/outputs
   - [ ] All error cases are identified with handling strategies and examples
   - [ ] All edge cases are documented with handling approaches and examples
   - [ ] Limitations are clearly stated with examples
   - [ ] Output formats are fully specified with examples
   - [ ] Progressive disclosure is optimized (description vs. body vs. references)
   - [ ] Scripts/references/assets are identified if needed
   - [ ] Compatibility requirements are documented
   - [ ] No placeholders remain (all [brackets] are filled)
   - [ ] All questions have been answered completely
   - [ ] User confirms 100% clarity and readiness

5. **Final Summary & Approval**

   Before writing ANY files:
   
   - Summarize everything you've learned about the skill
   - Present the complete structure: what will be in SKILL.md, what will be in scripts/, references/, assets/
   - Show the proposed description field
   - List all sections that will be in SKILL.md
   - Ask: "Is this complete and accurate? Are you 100% confident we have everything? Should I proceed with generating/updating the files?"

   **DO NOT PROCEED** until user explicitly confirms:
   - "Yes, everything is clear"
   - "Yes, proceed with generation"
   - "Yes, I'm confident this is complete"

6. **Implementation**

   Only after explicit approval:
   - Update SKILL.md with all gathered information
   - Create scripts/ directory and files if needed
   - Create references/ directory and files if needed
   - Create assets/ directory and files if needed
   - Remove all placeholders
   - Ensure progressive disclosure is optimized
   - Verify all examples are concrete and complete

**Question Format Guidelines**
- Be extremely verbose - ask comprehensive, detailed questions
- Always require examples: "Provide a concrete, detailed example with actual data"
- If answer is vague: "Can you be more specific? What exactly does that look like? Give me a real-world example with specific details."
- Use follow-ups: "Tell me more about [specific aspect]. How exactly does that work? What's a concrete example?"
- Proactively suggest: "Based on what you've told me, I think we should [suggestion]. What do you think?"
- Never assume - always ask for clarification

**Example Verbose Question Flow**
```
Q: "What is the exact purpose of this skill? Describe in detail what problem it solves or what capability it provides. Give me a concrete, real-world example of when someone would need this."

A: "It processes PDFs"

Q: "I need much more detail. What does 'process' mean exactly? Does it extract text, convert formats, merge files, fill forms, or something else? Give me a specific, detailed example: imagine a user has a PDF invoice - what exactly happens? What's the input, what are the steps, what's the output? Walk me through it step by step with actual data."

A: [User provides more detail]

Q: "Good, but I need to understand the complete workflow. You mentioned extracting invoice data - what specific fields? What format should the output be in? What if the PDF is scanned or has tables? Give me 3 concrete examples: (1) a simple text invoice, (2) a scanned invoice, (3) an invoice with a table. For each, show me the input and expected output."
```

**Output Format**
After approval, update/create:
- SKILL.md with complete, detailed content (no placeholders)
- scripts/ directory with executable code if needed
- references/ directory with detailed documentation if needed
- assets/ directory with templates/resources if needed
- All files should be production-ready with no placeholders

**Remember**
- Be verbose and comprehensive
- Never accept vague answers
- Proactively suggest best practices and resources
- Never build until 100% clear and approved
- One question at a time, wait for responses
- Continue until zero ambiguity remains
