const output = document.querySelector("#output");
const form = document.querySelector("#terminal-form");
const input = document.querySelector("#command");

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
    output.innerHTML = "";
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
  runCommand(input.value);
  input.value = "";
});
document.addEventListener("click", (event) => {
  if (!event.target.closest("a, input")) input.focus();
});
