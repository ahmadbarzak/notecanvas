# 📝 Notecanvas

**Notecanvas** is a real-time, modular journaling app designed for expressive, collaborative thinking. Capture fleeting thoughts through text, voice, and (soon) sketches — all in one flexible canvas, solo or shared.

> “A soft space for spontaneous expression.”

---

## 🚀 Features (MVP)

- ✅ Real-time collaborative text editing
- ✅ User authentication (via AWS Cognito)
- ✅ Save and load journal entries to/from AWS DynamoDB
- ✅ Modular journaling (text blocks now, audio and sketch coming soon)
- 🚧 AI-powered summarization and emotional tagging *(in progress)*
- 🚧 Voice modules: draggable, playable audio notes *(planned)*

---

## 🧠 Why This Exists

Most journaling tools:
- Focus on individual productivity
- Are rigid in structure
- Ignore voice and real-time collaboration

**Notecanvas** is different. It's built for:
- Creatives who think out loud
- Friends/partners who reflect together
- People with neurodivergent thinking styles who need flexible, ambient tools

---

## 📐 Tech Stack

| Layer       | Tech                      |
|-------------|---------------------------|
| Frontend    | React + Tailwind CSS      |
| Realtime    | WebSockets (Socket.IO or API Gateway WS) |
| Auth        | AWS Cognito               |
| Backend     | AWS Lambda + API Gateway  |
| Database    | AWS DynamoDB              |
| Hosting     | S3 + CloudFront           |
| AI (future) | OpenAI API / AWS Bedrock  |

---

## 🌱 Status

This is an early-stage solo project built for:
- Real-world AWS experience
- Deepening fullstack skills
- Exploring expressive, emotional software design

Expect rapid iteration over weekends and public development logs.

---

## 📸 Screenshots

*(Coming soon – UI wireframes or MVP GIFs)*

---

## 📌 Roadmap

- [ ] MVP journaling experience (text blocks + auth + save/load)
- [ ] Modular system for notes (block-based structure)
- [ ] Audio module drag/drop/play
- [ ] Real-time sync between users
- [ ] AI-powered summarization + mood feedback
- [ ] Emotional design polish (animations, ambient UI)

---

## 🙌 Contributing

Right now this is a solo project for portfolio purposes, but if you're a designer, writer, or dev who's curious about the idea — feel free to open an issue or say hi.

If you want to contribute code, please fork the repo and submit a PR. I’m open to feedback and suggestions!
To ensure compatibility:

- Use Node version specified in `.nvmrc`
- Run `nvm use` after cloning
- Tailwind is pinned to v3.4.1 to avoid future CLI compatibility issues

---

## 🧑‍💻 Created By

**Ahmad Barzak**  
🧠 Software Engineering Graduate | 🎨 Creative Technologist | ✍️ Reflective Builder 

[LinkedIn](#) • [Portfolio](#) • [Email](#)

---

## 💬 License

MIT — free to use, remix, and build upon. Attribution appreciated.
