# AI Literacy Log — E.A.C. Insurance

Per **EU AI Act Article 4** (in force since 2 February 2025), providers and deployers of AI systems must ensure that their staff and other persons dealing with the operation and use of AI systems on their behalf are made AI literate, taking into account their technical knowledge, experience, education and training, the context the AI systems are to be used in, and the persons or groups of persons on whom the AI systems are to be used.

## Scope

E.A.C. Insurance deploys one AI system: a website chatbot powered by **Botpress** (chatbot platform) using **OpenAI** (LLM provider) as the underlying language model. E.A.C. does not develop, train, or fine-tune the AI model. E.A.C. is a **deployer**, not a provider, under the AI Act.

The chatbot is classified as a **limited-risk AI system** under the AI Act. The primary obligation is **transparency** (Art. 50): users must be informed they are interacting with an AI system. This is satisfied via:
- AI disclosure in the chatbot welcome message
- AI disclosure in the website footer on all pages
- Section 8 of the privacy policy ("AI-Powered Chat Assistant")

## Staff

| Person | Role | AI system interaction |
|--------|------|-----------------------|
| Andros Panayiotou | CEO, sole staff member | Reviews chatbot lead summaries in Google Sheet; may need to follow up on chatbot conversations; handles data subject requests related to chatbot data |

## Briefing record

| Date | Topic | Method | Documented by |
|------|-------|--------|---------------|
| 2026-05-23 | Initial briefing: how the chatbot works, its limitations, when to escalate, how to handle GDPR data subject requests related to chatbot data | Verbal walkthrough with Marinos | Marinos Antoniou |

## Key understandings (covered in initial briefing)

1. The chatbot is an AI system — it can produce incorrect, incomplete, or misleading responses (hallucination)
2. The chatbot does NOT provide binding quotes, legal advice, or confirmation of coverage
3. All insurance claims, quotes, and personalised advice must come from Andros directly
4. Conversation summaries arrive in the Google Sheet — Andros must follow up with leads within business hours
5. If a user requests data erasure (GDPR Art. 17), Andros must contact Marinos to execute deletion in both Botpress (conversation logs) and Google Sheet (lead summary)
6. The chatbot uses OpenAI as its LLM backend; Andros has no direct OpenAI account and does not need one
7. Botpress retains conversation logs for 90 days, after which they are automatically deleted
8. The chatbot's system prompt contains marketing-oriented phrases that are flagged for review under Cyprus Insurance Distribution Law (Phase 4 remainder)

## Refresher cadence

Annual review. Next due: **2027-05-23**.

## Updates required when

- New AI capabilities are added to the chatbot (e.g. document upload, image generation)
- The LLM provider changes (e.g. Botpress switches from OpenAI to another provider)
- Major changes to the chatbot conversation flow or system prompt
- New staff members are hired who will interact with chatbot data
- EU AI Act regulatory updates that affect deployer obligations
- Significant incidents involving the chatbot (e.g. harmful output, data leak)
