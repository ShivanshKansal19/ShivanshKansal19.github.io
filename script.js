const output = document.querySelector('#terminal-output');
const form = document.querySelector('#terminal-form');
const input = document.querySelector('#command');

const commands = {
  help: `Available commands: <code>about</code>, <code>projects</code>, <code>socials</code>, <code>contact</code>, <code>clear</code>`,
  about: `I’m Shiva — a developer focused on crafting useful, considered digital products. <a href="#about">Read more ↓</a>`,
  projects: `A selection of things I’ve built. <a href="#projects">View projects ↓</a>`,
  socials: `Find me on <a href="https://github.com/your-github-username" target="_blank">GitHub</a>, <a href="https://www.linkedin.com/in/your-linkedin-username" target="_blank">LinkedIn</a>, and <a href="https://x.com/your-handle" target="_blank">X</a>.`,
  contact: `Say hello at <a href="mailto:hello@example.com">hello@example.com</a> — I’d love to hear from you.`,
  whoami: `shiva — developer, builder, lifelong learner.`,
};

function runCommand(value) {
  const command = value.trim().toLowerCase();
  if (!command) return;
  output.insertAdjacentHTML('beforeend', `<p><span class="prompt">shiva@portfolio:~$</span> ${command}</p>`);
  if (command === 'clear') { output.innerHTML = ''; return; }
  const response = commands[command] || `command not found: ${command}. Try <code>help</code>.`;
  output.insertAdjacentHTML('beforeend', `<p class="response">${response}</p>`);
  output.scrollTop = output.scrollHeight;
}

form.addEventListener('submit', (event) => { event.preventDefault(); runCommand(input.value); input.value = ''; });
document.querySelectorAll('[data-command]').forEach((button) => button.addEventListener('click', () => { runCommand(button.dataset.command); input.focus(); }));
document.addEventListener('click', (event) => { if (!event.target.closest('a, button, input')) input.focus(); });
document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .13 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
