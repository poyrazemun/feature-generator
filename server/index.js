const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/generate", (req, res) => {
  const { feature, featureTags, featureComment, scenarios } = req.body;

  let content = "";

  // Add tags if they exist
  if (featureTags && featureTags.length > 0) {
    content += featureTags.map(tag => `@${tag}`).join(" ") + "\n\n";
  }

  // Add comment if it exists
  if (featureComment && featureComment.trim()) {
    content += featureComment.split('\n')
      .map(line => `# ${line.trim()}`)
      .join('\n') + "\n\n";
  }

  content += `Feature: ${feature}\n\n`;

  // Önce Background'ları ekle
  scenarios.forEach(scenario => {
    if (scenario.type === "Background") {
      content += scenario.tags?.length > 0 ? 
        `  ${scenario.tags.map(tag => `@${tag}`).join(" ")}\n` : '';
      content += `  Background: ${scenario.name}\n` +
        scenario.steps.map(step => `    ${step}`).join("\n") +
        "\n\n";
    }
  });

  // Sonra diğer senaryoları ekle
  scenarios.forEach(scenario => {
    if (scenario.type !== "Background") {
      if (scenario.type === "Scenario Outline") {
        content += scenario.tags?.length > 0 ? 
          `  ${scenario.tags.map(tag => `@${tag}`).join(" ")}\n` : '';
        content += `  Scenario Outline: ${scenario.name}\n` +
          scenario.steps.map(step => `    ${step}`).join("\n") +
          "\n";

        if (scenario.examples && scenario.examples.headers.length > 0) {
          content += "    Examples:\n";
          // Boş header'ları filtrele
          const validHeaders = scenario.examples.headers.filter(header => header.trim() !== "");
          if (validHeaders.length > 0) {
            content += "      | " + validHeaders.join(" | ") + " |\n";
            // Boş satırları filtrele
            scenario.examples.rows.forEach(row => {
              const validRow = row.slice(0, validHeaders.length);
              if (validRow.some(cell => cell.trim() !== "")) {
                content += "      | " + validRow.join(" | ") + " |\n";
              }
            });
          }
        }
        content += "\n";
      } else {
        content += scenario.tags?.length > 0 ? 
          `  ${scenario.tags.map(tag => `@${tag}`).join(" ")}\n` : '';
        content += `  Scenario: ${scenario.name}\n` +
          scenario.steps.map(step => `    ${step}`).join("\n") +
          "\n\n";
      }
    }
  });

  const fileName = `${feature.replace(/\s+/g, "_")}.feature`;
  const filePath = path.join(__dirname, fileName);

  fs.writeFileSync(filePath, content, "utf8");
  res.download(filePath, fileName, () => {
    fs.unlinkSync(filePath);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
