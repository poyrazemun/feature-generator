import React, { useState } from "react";
import axios from "axios";

const cucumberKeywords = ["Given", "When", "Then", "And"];
const scenarioTypes = ["Scenario", "Background", "Scenario Outline"];

function FeatureForm() {
  // Önce yardımcı fonksiyonları tanımlayalım
  const saveToLocalStorage = (data) => {
    localStorage.setItem('featureFormData', JSON.stringify(data));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('featureFormData');
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  };

  // Sonra state'leri tanımlayalım
  const savedData = loadFromLocalStorage();
  const [feature, setFeature] = useState(savedData?.feature || "");
  const [scenarios, setScenarios] = useState(savedData?.scenarios || [{
    type: "Scenario",
    name: "",
    tags: [],
    steps: [{ keyword: "Given", text: "" }],
    examples: { headers: [], rows: [[]] }
  }]);
  const [featureTags, setFeatureTags] = useState(savedData?.featureTags || []);
  const [featureComment, setFeatureComment] = useState(savedData?.featureComment || "");
  const [newTag, setNewTag] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showScenarioTags, setShowScenarioTags] = useState({});

  const handleScenarioChange = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = value;
    
    if (value === "Scenario Outline" && newScenarios[index].examples.headers.length === 0) {
      newScenarios[index].examples = {
        headers: [""],
        rows: [[""]]
      };
    }
    
    setScenarios(newScenarios);
  };

  const handleStepChange = (scenarioIndex, stepIndex, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].steps[stepIndex][field] = value;
    setScenarios(newScenarios);
  };

  const addStep = (scenarioIndex) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].steps.push({ keyword: "And", text: "" });
    setScenarios(newScenarios);
  };

  const addScenario = () => {
    setScenarios([
      ...scenarios,
      {
        type: "Scenario",
        name: "",
        tags: [],
        steps: [{ keyword: "Given", text: "" }],
        examples: { headers: [], rows: [[]] }
      }
    ]);
  };

  const handleExampleHeaderChange = (scenarioIndex, value, headerIndex) => {
    const newScenarios = [...scenarios];
    if (!newScenarios[scenarioIndex].examples.headers[headerIndex]) {
      newScenarios[scenarioIndex].examples.headers[headerIndex] = "";
    }
    newScenarios[scenarioIndex].examples.headers[headerIndex] = value;
    setScenarios(newScenarios);
  };

  const handleExampleRowChange = (scenarioIndex, rowIndex, colIndex, value) => {
    const newScenarios = [...scenarios];
    if (!newScenarios[scenarioIndex].examples.rows[rowIndex]) {
      newScenarios[scenarioIndex].examples.rows[rowIndex] = [];
    }
    newScenarios[scenarioIndex].examples.rows[rowIndex][colIndex] = value;
    setScenarios(newScenarios);
  };

  const addExampleColumn = (scenarioIndex) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].examples.headers.push("");
    newScenarios[scenarioIndex].examples.rows.forEach(row => row.push(""));
    setScenarios(newScenarios);
  };

  const addExampleRow = (scenarioIndex) => {
    const newScenarios = [...scenarios];
    const headerLength = newScenarios[scenarioIndex].examples.headers.length;
    newScenarios[scenarioIndex].examples.rows.push(new Array(headerLength).fill(""));
    setScenarios(newScenarios);
  };

  const removeScenario = (index) => {
    const newScenarios = scenarios.filter((_, i) => i !== index);
    setScenarios(newScenarios);
  };

  const addFeatureTag = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      setFeatureTags([...featureTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeFeatureTag = (tagToRemove) => {
    setFeatureTags(featureTags.filter(tag => tag !== tagToRemove));
  };

  const removeStep = (scenarioIndex, stepIndex) => {
    const newScenarios = [...scenarios];
    if (newScenarios[scenarioIndex].steps.length > 1) {
      newScenarios[scenarioIndex].steps = newScenarios[scenarioIndex].steps.filter((_, i) => i !== stepIndex);
      setScenarios(newScenarios);
    }
  };

  const addScenarioTag = (scenarioIndex, tag) => {
    if (tag.trim()) {
      const newScenarios = [...scenarios];
      if (!newScenarios[scenarioIndex].tags) {
        newScenarios[scenarioIndex].tags = [];
      }
      newScenarios[scenarioIndex].tags.push(tag.trim());
      setScenarios(newScenarios);
    }
  };

  const removeScenarioTag = (scenarioIndex, tagToRemove) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].tags = newScenarios[scenarioIndex].tags.filter(
      tag => tag !== tagToRemove
    );
    setScenarios(newScenarios);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasInvalidScenarioOutline = scenarios.some(scenario => 
      scenario.type === "Scenario Outline" && 
      (scenario.examples.headers.length === 0 || 
       !scenario.examples.headers.some(header => header.trim()) ||
       scenario.examples.rows.length === 0 || 
       !scenario.examples.rows.some(row => row.some(cell => cell.trim())))
    );

    if (hasInvalidScenarioOutline) {
      alert("Please add at least one header and one row to Examples table in Scenario Outline");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/generate",
        {
          feature,
          featureTags,
          featureComment,
          scenarios: scenarios.map(scenario => ({
            type: scenario.type,
            name: scenario.name,
            steps: scenario.steps.map(step => `${step.keyword} ${step.text}`),
            examples: scenario.type === "Scenario Outline" ? scenario.examples : null
          }))
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${feature.replace(/\s+/g, "_")}.feature`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating feature file:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Feature File</h2>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Feature</label>
        <input
          type="text"
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          required
        />
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 mb-2"
        >
          <svg 
            className={`w-4 h-4 transform transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced Options (Tags & Comments)
        </button>

        {showAdvancedOptions && (
          <div className="bg-gray-50 p-4 rounded border mb-4 transition-all">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Feature Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {featureTags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                  >
                    @{tag}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); removeFeatureTag(tag); }}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag"
                  className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700"
                />
                <button
                  type="button"
                  onClick={addFeatureTag}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Add Tag
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Feature Comment
              </label>
              <textarea
                value={featureComment}
                onChange={(e) => setFeatureComment(e.target.value)}
                placeholder="Add a comment to your feature (optional)"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-24"
              />
            </div>
          </div>
        )}
      </div>

      {scenarios.map((scenario, scenarioIndex) => (
        <div key={scenarioIndex} className="mb-6 p-4 border rounded">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{scenario.type}</h3>
            <button
              type="button"
              onClick={() => removeScenario(scenarioIndex)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              <span>Remove</span>
            </button>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowScenarioTags({
                ...showScenarioTags,
                [scenarioIndex]: !showScenarioTags[scenarioIndex]
              })}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 mb-2"
            >
              <svg 
                className={`w-4 h-4 transform transition-transform ${showScenarioTags[scenarioIndex] ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {scenario.type} Tags
            </button>

            {showScenarioTags[scenarioIndex] && (
              <div className="bg-gray-50 p-4 rounded border mb-4 transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                  {scenario.tags?.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      @{tag}
                      <button
                        type="button"
                        onClick={() => removeScenarioTag(scenarioIndex, tag)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add new tag"
                    className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addScenarioTag(scenarioIndex, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      addScenarioTag(scenarioIndex, input.value);
                      input.value = '';
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
            <select
              value={scenario.type}
              onChange={(e) => handleScenarioChange(scenarioIndex, "type", e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              {scenarioTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={scenario.name}
              onChange={(e) => handleScenarioChange(scenarioIndex, "name", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Steps</label>
            {scenario.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="flex gap-2 mb-2">
                <select
                  value={step.keyword}
                  onChange={(e) => handleStepChange(scenarioIndex, stepIndex, "keyword", e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {cucumberKeywords.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={step.text}
                  onChange={(e) => handleStepChange(scenarioIndex, stepIndex, "text", e.target.value)}
                  className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700"
                  required
                  placeholder={`Step ${stepIndex + 1}`}
                />
                {scenario.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(scenarioIndex, stepIndex)}
                    className="text-gray-500 hover:text-red-600 px-2 rounded-md hover:bg-red-50 transition-all duration-200"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addStep(scenarioIndex)}
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              + Add Step
            </button>
          </div>

          {scenario.type === "Scenario Outline" && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Examples <span className="text-red-500">*</span>
              </label>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr>
                      {scenario.examples.headers.map((header, index) => (
                        <th key={index} className="border p-2">
                          <input
                            type="text"
                            value={header}
                            onChange={(e) => handleExampleHeaderChange(scenarioIndex, e.target.value, index)}
                            placeholder="Header (required)"
                            className="w-full p-1"
                            required
                          />
                        </th>
                      ))}
                      <th className="border p-2">
                        <button
                          type="button"
                          onClick={() => addExampleColumn(scenarioIndex)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          +
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenario.examples.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border p-2">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleExampleRowChange(scenarioIndex, rowIndex, colIndex, e.target.value)}
                              placeholder="Value"
                              className="w-full p-1"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={scenario.examples.headers.length + 1} className="border p-2">
                        <button
                          type="button"
                          onClick={() => addExampleRow(scenarioIndex)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          + Add Row
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="mb-6">
        <button
          type="button"
          onClick={addScenario}
          className="text-blue-500 hover:bg-blue-100 font-semibold py-2 px-4 border border-blue-500 rounded w-full"
        >
          Add New Scenario
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => {
            // Form verilerini temizle
            setFeature("");
            setScenarios([{
              type: "Scenario",
              name: "",
              tags: [],
              steps: [{ keyword: "Given", text: "" }],
              examples: { headers: [], rows: [[]] }
            }]);
            setFeatureTags([]);
            setFeatureComment("");
            setNewTag("");
            // LocalStorage'ı da temizle
            localStorage.removeItem('featureFormData');
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex-1"
        >
          Clear Form
        </button>
        <button
          type="button"
          onClick={() => {
            saveToLocalStorage({
              feature,
              scenarios,
              featureTags,
              featureComment
            });
            alert("Form data saved successfully!");
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex-1"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex-1"
        >
          Download Feature File
        </button>
      </div>
    </form>
  );
}

export default FeatureForm;
