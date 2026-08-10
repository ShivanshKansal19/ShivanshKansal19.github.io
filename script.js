const output = document.querySelector("#output");
const initialOutput = output.innerHTML;
const form = document.querySelector("#terminal-form");
const input = document.querySelector("#command");
const ghostHint = document.querySelector("#ghost-hint");
const commandHistory = [];
let historyIndex = -1;
let pendingInput = "";

const commands = {
  help: `<span class="title">AVAILABLE COMMANDS</span>\n  <code>about/whoami</code>      learn a little about me\n  <code>projects</code>   see selected work\n  <code>skills</code>     view my toolkit\n  <code>socials</code>    find me online\n  <code>contact</code>    get in touch\n  <code>resume</code>     open my resume\n  <code>clear</code>      clear the terminal\n\n<span class="title">TIP</span>\n  Press <code style="color:var(--green)">[Tab]</code> or <code style="color:var(--green)">[&rarr;]</code> to auto-complete commands or view suggestions.`,
  about: `<span class="title">ABOUT</span>\nI'm Shivansh Kansal, a Computer Science graduate with a passion for software development.\nI build data-driven web applications and enjoy solving complex problems with thoughtful engineering.`,
  projects: `<span class="title">SELECTED PROJECTS</span>\n01  TradeNet - Django investment analysis platform with AI insights\n    Reduced loading time by 75% using batch processing and page caching.\n\n02  Real-time Clickstream ELT Pipeline\n    Built a Kafka, PySpark, S3, Snowflake, and dbt pipeline for 10,000+ events/second.\n    Reduced end-to-end data latency by 60% through tuning and optimized SQL.`,
  skills: `<span class="title">SKILLS</span>\n\n<span class="green">LANGUAGES</span>\nPython | Go | SQL | JavaScript | C\n\n<span class="green">LIBRARIES &amp; FRAMEWORKS</span>\nDjango | Flask | React | REST APIs | PySpark | TensorFlow | PyTorch | scikit-learn | Pandas | NumPy | Matplotlib | Seaborn\n\n<span class="green">TOOLS</span>\nGit | GitHub | AWS | Apache Kafka | dbt\n\n<span class="green">DATABASES</span>\nPostgreSQL | MySQL | Snowflake`,
  socials: `<span class="title">FIND ME ONLINE</span>\nGitHub    <a href="https://github.com/shivanshkansal19" target="_blank" rel="noreferrer">github.com/shivanshkansal19 -&gt;</a>\nLinkedIn  <a href="https://www.linkedin.com/in/shivansh-kansal-05a233247" target="_blank" rel="noreferrer">linkedin.com/in/shivansh-kansal-05a233247 -&gt;</a>\nX         <a href="https://x.com/ShivanshKansal8" target="_blank" rel="noreferrer">x.com/ShivanshKansal8 -&gt;</a>`,
  contact: `<span class="title">CONTACT</span>\nWant to build something together?\nEmail me at <a href="mailto:shivanshkansal19@gmail.com">shivanshkansal19@gmail.com -&gt;</a>`,
};
commands.whoami = commands.about;

const validCommands = Object.keys(commands);
validCommands.push("clear");



// Tab Autocomplete & Ghost Hint State
let tabMatches = [];
let tabIndex = -1;
let lastTabPrefix = "";
let ghostSuggestion = "";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function updateGhostHint() {
  if (!ghostHint) return;
  const rawVal = input.value;
  const val = rawVal.trim().toLowerCase();

  // Hide ghost hint if input is empty, has spaces, or when cycling through multiple matches
  if (!val || rawVal.includes(" ") || (tabMatches.length > 1 && tabIndex >= 0)) {
    ghostHint.innerHTML = "";
    ghostSuggestion = "";
    return;
  }

  const match = validCommands.find(
    (cmd) => cmd.startsWith(val) && cmd !== val
  );

  if (match) {
    ghostSuggestion = match;
    const typedPart = rawVal;
    const remainingPart = match.slice(val.length);
    ghostHint.innerHTML = `<span class="ghost-typed">${escapeHtml(
      typedPart
    )}</span><span class="ghost-suffix">${escapeHtml(remainingPart)}</span>`;
  } else {
    ghostHint.innerHTML = "";
    ghostSuggestion = "";
  }
}

function resetTabState() {
  tabMatches = [];
  tabIndex = -1;
  lastTabPrefix = "";
}

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
    `<span class="green">shiva@portfolio</span>:<span class="blue">~</span>$ <span class="entered-command">${escapeHtml(rawCommand)}</span>`
  );

  if (command === "clear") {
    output.innerHTML = initialOutput;
    return;
  }

  if (command === "resume") {
    window.open("Shivansh_Kansal_Resume.pdf", "_blank", "noopener");
    return;
  }

  print(
    commands[command] ||
    `command not found: <span class="entered-command">${escapeHtml(command)}</span>\nType <code>help</code> to see available commands.`,
    "response"
  );
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function handleTabCompletion() {
  const rawVal = input.value;
  const val = rawVal.trim().toLowerCase();

  // Case 1: Tab on empty prompt -> list available commands or cycle them
  if (!val) {
    if (tabMatches.length === 0) {
      tabMatches = [...validCommands];
      print(
        `<span class="tab-suggestions">Commands: ${validCommands
          .map((c) => `<code>${c}</code>`)
          .join("  ")}</span>`,
        "response"
      );
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      tabIndex = (tabIndex + 1) % tabMatches.length;
      input.value = tabMatches[tabIndex] + " ";
    }
    updateGhostHint();
    return;
  }

  // Case 2: New completion request
  if (tabMatches.length === 0 || lastTabPrefix !== val) {
    const matches = validCommands.filter((cmd) => cmd.startsWith(val));

    if (matches.length === 0) {
      return;
    }

    if (matches.length === 1) {
      input.value = matches[0] + " ";
      resetTabState();
      updateGhostHint();
      return;
    }

    // Find longest common prefix for multiple matches
    let commonPrefix = matches[0];
    for (let i = 1; i < matches.length; i++) {
      while (!matches[i].startsWith(commonPrefix)) {
        commonPrefix = commonPrefix.slice(0, -1);
      }
    }

    if (commonPrefix.length > val.length) {
      input.value = commonPrefix;
    }

    print(
      `<span class="tab-suggestions">Suggestions: ${matches
        .map((c) => `<code>${c}</code>`)
        .join("  ")}</span>`,
      "response"
    );
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    tabMatches = matches;
    tabIndex = -1;
    lastTabPrefix = input.value.trim().toLowerCase();
    updateGhostHint();
    return;
  }

  // Case 3: Consecutive Tab presses -> cycle through matching commands
  tabIndex = (tabIndex + 1) % tabMatches.length;
  input.value = tabMatches[tabIndex] + " ";
  lastTabPrefix = input.value.trim().toLowerCase();
  updateGhostHint();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const submittedCommand = input.value.trim();
  if (submittedCommand) commandHistory.push(submittedCommand);
  runCommand(input.value);
  input.value = "";
  historyIndex = -1;
  pendingInput = "";
  resetTabState();
  updateGhostHint();
});

input.addEventListener("input", () => {
  resetTabState();
  updateGhostHint();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    handleTabCompletion();
    return;
  }

  if (event.key === "ArrowRight" && input.selectionStart === input.value.length) {
    if (ghostSuggestion) {
      event.preventDefault();
      input.value = ghostSuggestion + " ";
      resetTabState();
      updateGhostHint();
      return;
    }
  }

  if (
    event.key !== "Shift" &&
    event.key !== "Control" &&
    event.key !== "Alt" &&
    event.key !== "Meta"
  ) {
    resetTabState();
  }

  if (event.key === "ArrowUp" && commandHistory.length) {
    event.preventDefault();
    if (historyIndex === -1) pendingInput = input.value;
    historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    input.value = commandHistory[commandHistory.length - 1 - historyIndex];
    updateGhostHint();
  }

  if (event.key === "ArrowDown" && historyIndex !== -1) {
    event.preventDefault();
    historyIndex -= 1;
    input.value =
      historyIndex === -1
        ? pendingInput
        : commandHistory[commandHistory.length - 1 - historyIndex];
    updateGhostHint();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("a, input")) input.focus();
});
