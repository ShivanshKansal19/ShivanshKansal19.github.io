const output = document.querySelector("#output");
const initialOutput = output.innerHTML;
const form = document.querySelector("#terminal-form");
const input = document.querySelector("#command");
const commandHistory = [];
let historyIndex = -1;
let pendingInput = "";

const commands = {
  help: `<span class="title">AVAILABLE COMMANDS</span>\n  <code>about</code>      learn a little about me\n  <code>projects</code>   see selected work\n  <code>skills</code>     view my toolkit\n  <code>socials</code>    find me online\n  <code>contact</code>    get in touch\n  <code>resume</code>     download my resume\n  <code>clear</code>      clear the terminal`,
  about: `<span class="title">ABOUT</span>\nI’m Shiva, a developer who builds useful, thoughtful digital products.\nI enjoy turning ambitious ideas into calm, intuitive experiences.`,
  projects: `<span class="title">SELECTED PROJECTS</span>\n01  Pulse Analytics  — data visualization platform\n02  Habit            — a kinder habit tracker\n03  Folio Studio     — portfolio builder for creatives\n\nSee more at <a href="https://github.com/your-github-username" target="_blank" rel="noreferrer">github.com/your-github-username ↗</a>`,
  skills: `<span class="title">TOOLKIT</span>\nJavaScript · TypeScript · React · Node.js · UI / UX`,
  socials: `<span class="title">FIND ME ONLINE</span>\nGitHub    <a href="https://github.com/your-github-username" target="_blank" rel="noreferrer">github.com/your-github-username ↗</a>\nLinkedIn  <a href="https://www.linkedin.com/in/your-linkedin-username" target="_blank" rel="noreferrer">linkedin.com/in/your-linkedin-username ↗</a>\nX         <a href="https://x.com/your-handle" target="_blank" rel="noreferrer">x.com/your-handle ↗</a>`,
  contact: `<span class="title">CONTACT</span>\nWant to build something together?\nEmail me at <a href="mailto:hello@example.com">hello@example.com ↗</a>`,
  resume: `My resume will be available here soon.`,
  whoami: `shiva — developer, builder, lifelong learner.`,
};

Object.assign(commands, {
  about: `<span class="title">ABOUT</span>\nI’m Shivansh Kansal, a Computer Science graduate with a passion for software development.\nI build data-driven web applications and enjoy solving complex problems with thoughtful engineering.`,
  projects: `<span class="title">SELECTED PROJECTS</span>\n01  TradeNet — Django investment analysis platform with AI insights\n    Reduced loading time by 75% using batch processing and page caching.\n\n02  Real-time Clickstream ELT Pipeline\n    Built a Kafka, PySpark, S3, Snowflake, and dbt pipeline for 10,000+ events/second.\n    Reduced end-to-end data latency by 60% through tuning and optimized SQL.`,
  skills: `<span class="title">TOOLKIT</span>\nPython · Go · SQL · Django · JavaScript · Git · AWS\n\nAlso: Apache Kafka · PySpark · Snowflake · dbt`,
  contact: `<span class="title">CONTACT</span>\nWant to build something together?\nEmail me at <a href="mailto:shivanshkansal19@gmail.com">shivanshkansal19@gmail.com ↗</a>`,
  resume: `<span class="title">RESUME</span>\n<a href="Shivansh_Kansal_CV.pdf" target="_blank" rel="noreferrer">Download my resume (PDF) ↗</a>`,
  whoami: `shivansh-kansal — software developer, data enthusiast, lifelong learner.`,
});

function print(value, className = "") {
  const line = document.createElement("p");
  line.className = className;
  line.innerHTML = value;
  output.append(line);
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;
  print(
    `<span class="green">shiva@portfolio</span>:<span class="blue">~</span>$ <span class="entered-command">${command}</span>`,
  );
  if (command === "clear") {
    output.innerHTML = initialOutput;
    return;
  }
  if (command === "resume") {
    window.open("Shivansh_Kansal_CV.pdf", "_blank", "noopener");
    return;
  }
  print(
    commands[command] ||
      `command not found: <span class="entered-command">${command}</span>\nType <code>help</code> to see available commands.`,
    "response",
  );
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const submittedCommand = input.value.trim();
  if (submittedCommand) commandHistory.push(submittedCommand);
  runCommand(input.value);
  input.value = "";
  historyIndex = -1;
  pendingInput = "";
});

input.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && commandHistory.length) {
    event.preventDefault();
    if (historyIndex === -1) pendingInput = input.value;
    historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    input.value = commandHistory[commandHistory.length - 1 - historyIndex];
  }

  if (event.key === "ArrowDown" && historyIndex !== -1) {
    event.preventDefault();
    historyIndex -= 1;
    input.value =
      historyIndex === -1
        ? pendingInput
        : commandHistory[commandHistory.length - 1 - historyIndex];
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest("a, input")) input.focus();
});
