// Acknowledgement: This file includes changes assisted by ChatGPT (OpenAI).
`use strict`;

class Utils {
  // Return current date and time string (server time)
  getDateString() {
    return new Date().toString();
  }

  // Render inline-styled text div (color and joiner injected)
  renderStyledText(name, template, dateStr, color, joiner) {
    const safeName = (name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const greetMsg = `${template.replace("%1", safeName)}${joiner}${dateStr}`;
    return `<div style="color: ${color};">${greetMsg}</div>`;
  }
}

module.exports = new Utils();
