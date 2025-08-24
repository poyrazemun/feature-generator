import React, { useState } from "react";
import axios from "axios";

import "../button85.css";

const cucumberKeywords = ["Given", "When", "Then", "And"];
const scenarioTypes = ["Scenario", "Background", "Scenario Outline"];

// Step templates for standardization
const stepTemplates = {
  Given: [
    "As a {role}",
    "I am on the {page}",
    "I have {item}",
    "I am logged in as {user}",
    "The system has {data}",
    "I am a {role} user",
    "I have access to {feature}",
    "The {component} is {state}",
    "I am in {location}",
    "The {service} is running",
    "I have a valid API key",
    "I have authentication token",
    "The API endpoint is available",
    "I have test data prepared",
    "The database is seeded with {data}",
    "I have {permission} access to the API",
    "The external service is running",
    "I have valid credentials for {service}",
    "The API rate limit is not exceeded",
    "I have a valid session token",
    "The Kafka topic {topic} is available",
    "The Kafka consumer is running",
    "The Kafka producer is configured",
    "The database table {table} exists",
    "The database has initial data in {table}",
    "The Kafka broker is reachable",
    "The consumer group {group} is active",
    "The schema registry is available",
    "The Kafka connection is established",
  ],
  When: [
    "I click on {element}",
    "I enter {text} in {field}",
    "I select {option} from {dropdown}",
    "I navigate to {page}",
    "I submit the form",
    "I hover over {element}",
    "I drag {item} to {target}",
    "I press {key}",
    "I wait for {condition}",
    "I refresh the page",
    "I scroll to {element}",
    "I close the {modal}",
    "I open the {menu}",
    "I search for {query}",
    "I filter by {criteria}",
    "I send a GET request to {endpoint}",
    "I send a POST request to {endpoint} with {data}",
    "I send a PUT request to {endpoint} with {data}",
    "I send a DELETE request to {endpoint}",
    "I send a PATCH request to {endpoint} with {data}",
    "I set the Authorization header to {token}",
    "I set the Content-Type header to {type}",
    "I add {header} header with value {value}",
    "I include {parameter} as query parameter",
    "I send the request with {body}",
    "I wait for the API response",
    "I retry the failed request",
    "I validate the response schema",
    "I check the response status code",
    "I parse the JSON response",
    "I produce a message to {topic}",
    "I send {data} to Kafka topic {topic}",
    "I update the database table {table}",
    "I insert {data} into table {table}",
    "I delete {record} from table {table}",
    "I modify {field} in table {table}",
    "I consume a message from {topic}",
    "I listen to Kafka topic {topic}",
    "I trigger a database change in {table}",
    "I commit the Kafka offset",
    "I process the message from {topic}",
    "I serialize the message with {schema}",
    "I deserialize the message from {topic}",
    "I handle the message processing error",
    "I retry the failed message processing",
  ],
  Then: [
    "I should see {element}",
    "I should not see {element}",
    "The {field} should contain {value}",
    "The {element} should be {state}",
    "I should be redirected to {page}",
    "The {message} should appear",
    "The {count} should be {number}",
    "The {element} should have {attribute}",
    "The {page} should load successfully",
    "The {action} should complete",
    "I should receive {notification}",
    "The {status} should be {value}",
    "The {element} should be {position}",
    "The {data} should be {condition}",
    "The {system} should respond with {result}",
    "The API should return status code {code}",
    "The response should contain {field}",
    "The response time should be less than {time}ms",
    "The response should match the schema",
    "The error message should contain {text}",
    "The response headers should include {header}",
    "The response body should be valid JSON",
    "The API should return {count} items",
    "The response should be paginated",
    "The rate limit headers should be present",
    "The authentication should be successful",
    "The authorization should be denied",
    "The request should be logged",
    "The audit trail should be created",
    "The message should be published to {topic}",
    "The database table {table} should be updated",
    "The Kafka message should contain {field}",
    "The message should be consumed from {topic}",
    "The database record should be created in {table}",
    "The message offset should be committed",
    "The consumer lag should be {value}",
    "The message should match the schema",
    "The database transaction should be committed",
    "The message should be processed successfully",
    "The dead letter queue should receive {message}",
    "The message should be retried {count} times",
    "The database constraint should be enforced",
    "The message ordering should be preserved",
    "The partition assignment should be balanced",
    "The consumer group should rebalance",
    "The message should be serialized correctly",
  ],
  And: [
    "I should be on the {page}",
    "The {element} should be {state}",
    "I can see {item} in the list",
    "The {field} is {condition}",
    "I have access to {feature}",
    "The {component} displays correctly",
    "I can {action} without issues",
    "The {system} responds appropriately",
    "I receive {notification}",
    "The {data} is {state}",
    "I can navigate to {page}",
    "The {element} has {attribute}",
    "I can {action} successfully",
    "The {page} loads within {timeframe}",
    "I can {action} from {location}",
    "The {element} is properly positioned",
    "I can interact with {element}",
    "The {data} persists after {action}",
    "I can see the {notification}",
    "The {system} handles the request gracefully",
    "I can access {feature} from {location}",
    "The {component} updates in real-time",
    "I can {action} multiple {items}",
    "The {page} maintains its state",
    "I can {action} without losing {data}",
    "The API response is cached",
    "The database is updated with {data}",
    "The external service is notified",
    "The webhook is triggered",
    "The event is published to {queue}",
    "The metrics are recorded",
    "The logs contain {information}",
    "The performance meets SLA requirements",
    "The security headers are set correctly",
    "The CORS policy is enforced",
    "The rate limiting is working",
    "The circuit breaker is {state}",
    "The Kafka message is delivered",
    "The database is synchronized with Kafka",
    "The message processing is idempotent",
    "The consumer offset is tracking correctly",
    "The database transaction is atomic",
    "The message retry mechanism works",
    "The schema evolution is backward compatible",
    "The partition key is correctly assigned",
    "The dead letter topic receives failed messages",
    "The consumer group coordination is stable",
    "The message compression is applied",
    "The database indexes are updated",
    "The Kafka metrics are being collected",
    "The message throughput meets requirements",
    "The data consistency is maintained",
  ],
};

// Scenario name templates
const scenarioNameTemplates = {
  api: [
    "API returns {status} for {endpoint}",
    "API validates {input} and returns {response}",
    "API handles {error} gracefully",
    "API rate limiting works correctly",
    "API authentication succeeds with {credentials}",
    "API authorization fails for {user}",
    "API response time is within {limit}",
    "API returns correct {schema} format",
    "API handles {edge_case} properly",
    "API logs {action} correctly",
    "API creates audit trail for {operation}",
    "API integrates with {external_service}",
    "API webhook triggers {event}",
    "API cache works for {resource}",
    "API pagination works for {endpoint}",
    "API handles concurrent {requests}",
    "API security headers are set",
    "API CORS policy is enforced",
    "API circuit breaker activates for {condition}",
    "API metrics are recorded for {operation}",
    "API performance meets SLA requirements",
  ],
  kafka: [
    "Kafka message is produced to {topic}",
    "Database table {table} is updated via Kafka",
    "Kafka consumer processes {topic} messages",
    "Database change triggers Kafka message to {topic}",
    "Kafka message consumption updates {table}",
    "Message ordering is preserved in {topic}",
    "Consumer group handles {topic} rebalancing",
    "Dead letter queue receives failed {topic} messages",
    "Schema registry validates {topic} messages",
    "Kafka offset management for {topic}",
    "Database transaction consistency with Kafka",
    "Message retry mechanism for {topic}",
    "Kafka metrics monitoring for {topic}",
    "Consumer lag tracking for {topic}",
    "Message serialization for {topic}",
    "Database synchronization with Kafka events",
    "Kafka partition assignment for {topic}",
    "Message compression in {topic}",
    "Kafka security and authentication",
    "Data consistency between Kafka and database",
  ],
  others: [
    "User can {action} successfully",
    "User cannot {action} with invalid {data}",
    "System displays {element} when {condition}",
    "User is redirected to {page} after {action}",
    "Data is {state} when {condition}",
    "User receives {feedback} for {action}",
    "System validates {input} correctly",
    "User can access {feature} with {permission}",
    "Error message appears when {condition}",
    "User can {action} multiple {items}",
    "System handles {edge_case} gracefully",
    "User can {action} from {location}",
    "Data persists after {action}",
    "User can {action} without {requirement}",
    "System responds within {timeframe}",
    "User can {action} with valid {data}",
    "System prevents {action} with invalid {data}",
    "User can {action} and see {result}",
    "System shows {element} for {condition}",
    "User can {action} from different {location}",
    "Data is {state} after {action}",
    "User can {action} and maintain {state}",
    "System handles {action} gracefully",
    "User can {action} with {permission} level",
    "System validates {input} and shows {feedback}",
    "User can {action} and receive {notification}",
    "System processes {action} within {timeframe}",
    "User can {action} and access {feature}",
    "System maintains {state} during {action}",
    "User can {action} and navigate to {page}",
    "System updates {element} after {action}",
    "User can {action} and see {count} {items}",
    "System handles {action} and maintains {data}",
  ],
};

const defaultFeatureTags = [
  "smoke",
  "regression",
  "website",
  "infinity",
  "sanity",
  "kafka",
  "wip",
];

function FeatureForm() {
  // Önce yardımcı fonksiyonları tanımlayalım
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("featureFormData");
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  };

  // Sonra state'leri tanımlayalım
  const savedData = loadFromLocalStorage();
  const [feature, setFeature] = useState(savedData?.feature || "");
  // Change initial state for scenarios to be empty
  const [scenarios, setScenarios] = useState(
    savedData?.scenarios && savedData.scenarios.length > 0
      ? savedData.scenarios
      : []
  );
  const [featureTags, setFeatureTags] = useState(savedData?.featureTags || []);
  const [featureComment, setFeatureComment] = useState(
    savedData?.featureComment || ""
  );
  const [newTag, setNewTag] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showScenarioTags, setShowScenarioTags] = useState({});

  const handleScenarioChange = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = value;

    // Eğer tip 'Background' ise tag'leri sıfırla
    if (field === "type" && value === "Background") {
      newScenarios[index].tags = [];
    }

    if (
      value === "Scenario Outline" &&
      newScenarios[index].examples.headers.length === 0
    ) {
      newScenarios[index].examples = {
        headers: [""],
        rows: [[""]],
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
        examples: { headers: [], rows: [[]] },
      },
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
    newScenarios[scenarioIndex].examples.rows.forEach((row) => row.push(""));
    setScenarios(newScenarios);
  };

  const addExampleRow = (scenarioIndex) => {
    const newScenarios = [...scenarios];
    const headerLength = newScenarios[scenarioIndex].examples.headers.length;
    newScenarios[scenarioIndex].examples.rows.push(
      new Array(headerLength).fill("")
    );
    setScenarios(newScenarios);
  };

  const removeScenario = (index) => {
    const newScenarios = scenarios.filter((_, i) => i !== index);
    setScenarios(newScenarios);
  };

  const removeStep = (scenarioIndex, stepIndex) => {
    const newScenarios = [...scenarios];
    if (newScenarios[scenarioIndex].steps.length > 1) {
      newScenarios[scenarioIndex].steps = newScenarios[
        scenarioIndex
      ].steps.filter((_, i) => i !== stepIndex);
      setScenarios(newScenarios);
    }
  };

  // Template helper functions
  const applyStepTemplate = (template, keyword) => template;
  const applyScenarioNameTemplate = (template) => template;

  // Save form data to localStorage
  const [showDraftNotification, setShowDraftNotification] = useState(false);

  // Sadece localStorage'a kaydeden fonksiyon
  const saveFormDataToLocalStorage = () => {
    localStorage.setItem(
      "featureFormData",
      JSON.stringify({
        feature,
        scenarios,
        featureTags,
        featureComment,
      })
    );
  };

  // Bildirimli kaydeden fonksiyon
  const saveToLocalStorageWithNotification = () => {
    saveFormDataToLocalStorage();
    setShowDraftNotification(true);
    setTimeout(() => setShowDraftNotification(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save current form data before download (bildirim yok)
    saveFormDataToLocalStorage();

    const hasInvalidScenarioOutline = scenarios.some(
      (scenario) =>
        scenario.type === "Scenario Outline" &&
        (scenario.examples.headers.length === 0 ||
          !scenario.examples.headers.some((header) => header.trim()) ||
          scenario.examples.rows.length === 0 ||
          !scenario.examples.rows.some((row) =>
            row.some((cell) => cell.trim())
          ))
    );

    if (hasInvalidScenarioOutline) {
      alert(
        "Please add at least one header and one row to Examples table in Scenario Outline"
      );
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/generate`,
        {
          feature,
          featureTags,
          featureComment,
          scenarios: scenarios.map((scenario) => ({
            type: scenario.type,
            name: scenario.name,
            steps: scenario.steps.map((step) => `${step.keyword} ${step.text}`),
            examples:
              scenario.type === "Scenario Outline" ? scenario.examples : null,
          })),
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
      alert("Dosya başarıyla indirildi!");
      setFeature("");
      setFeatureTags([]); // <-- fix: should be array
      setFeatureComment("");
      setScenarios([]); // <-- fix: should be array
      localStorage.removeItem("featureFormData");
    } catch (error) {
      console.error("Error generating feature file:", error);
    }
  };

  return (
    <div className="relative">
      {showDraftNotification && (
        <div className="fixed top-6 right-6 bg-yellow-300 text-yellow-900 px-6 py-3 rounded-xl shadow-lg z-50 font-semibold text-base transition-all">
          Saved successfully!
        </div>
      )}
      {/* Floating Clear Form button (top right) */}
      <button
        type="button"
        onClick={() => {
          setFeature("");
          setScenarios([]);
          setFeatureTags([]);
          setFeatureComment("");
          setNewTag("");
          localStorage.removeItem("featureFormData");
        }}
        className="button-85 red fixed top-4 right-4 z-40"
      >
        Clear Form
      </button>
      {/* The form itself */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white via-blue-50 to-green-50 shadow-2xl rounded-2xl px-10 pt-8 pb-10 mb-8 max-w-2xl mx-auto mt-8 border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-lg tracking-wide">
          Write Your Feature File
        </h2>

        <div className="mb-6">
          <label className="block text-blue-700 text-base font-bold mb-2 tracking-wide">
            Feature
          </label>
          <input
            type="text"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="shadow appearance-none border border-blue-200 rounded-lg w-full py-3 px-4 text-gray-700 bg-gradient-to-r from-white via-blue-50 to-white focus:ring-2 focus:ring-blue-400 transition-all duration-200"
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
              className={`w-4 h-4 transform transition-transform ${
                showAdvancedOptions ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Advanced Options (Tags & Comments)
          </button>

          {showAdvancedOptions && (
            <div className="bg-gray-50 p-4 rounded border mb-4 transition-all">
              <div className="mb-4">
                <label className="block text-blue-700 text-base font-bold mb-2 tracking-wide">
                  Feature Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {defaultFeatureTags.map((tag) => (
                    <label
                      key={tag}
                      className={`px-2 py-1 rounded cursor-pointer border flex items-center gap-1 ${
                        featureTags.includes(tag)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-blue-800 border-blue-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={featureTags.includes(tag)}
                        onChange={() => {
                          if (featureTags.includes(tag)) {
                            setFeatureTags(
                              featureTags.filter((t) => t !== tag)
                            );
                          } else {
                            setFeatureTags([...featureTags, tag]);
                          }
                        }}
                        className="hidden"
                      />
                      @{tag}
                    </label>
                  ))}
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
                  className="shadow appearance-none border border-blue-200 rounded-lg w-full py-3 px-4 text-gray-700 h-24 bg-gradient-to-r from-white via-blue-50 to-white focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Only show scenarios if there is at least one */}
        {scenarios.length > 0 &&
          scenarios.map((scenario, scenarioIndex) => (
            <div
              key={scenarioIndex}
              className="mb-8 p-6 border border-blue-200 rounded-2xl bg-gradient-to-br from-white via-blue-100 to-green-100 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{scenario.type}</h3>
                <button
                  type="button"
                  onClick={() => removeScenario(scenarioIndex)}
                  className="button-85 red flex items-center gap-1"
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
                  onClick={() =>
                    setShowScenarioTags({
                      ...showScenarioTags,
                      [scenarioIndex]: !showScenarioTags[scenarioIndex],
                    })
                  }
                  className="text-blue-700 hover:text-blue-900 text-base flex items-center gap-2 mb-2 font-semibold bg-gradient-to-r from-blue-100 via-green-50 to-blue-100 px-3 py-2 rounded-xl shadow border border-blue-200 transition-all duration-200"
                >
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      showScenarioTags[scenarioIndex] ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {scenario.type} Tags
                </button>

                {showScenarioTags[scenarioIndex] && (
                  <div className="bg-gray-50 p-4 rounded border mb-4 transition-all">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {defaultFeatureTags.map((tag) => (
                        <label
                          key={tag}
                          className={`px-2 py-1 rounded cursor-pointer border flex items-center gap-1 ${
                            scenario.tags?.includes(tag)
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-blue-800 border-blue-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={scenario.tags?.includes(tag)}
                            onChange={() => {
                              const newScenarios = [...scenarios];
                              if (
                                newScenarios[scenarioIndex].tags?.includes(tag)
                              ) {
                                newScenarios[scenarioIndex].tags = newScenarios[
                                  scenarioIndex
                                ].tags.filter((t) => t !== tag);
                              } else {
                                newScenarios[scenarioIndex].tags = [
                                  ...(newScenarios[scenarioIndex].tags || []),
                                  tag,
                                ];
                              }
                              setScenarios(newScenarios);
                            }}
                            className="hidden"
                          />
                          @{tag}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Type
                </label>
                <select
                  value={scenario.type}
                  onChange={(e) =>
                    handleScenarioChange(scenarioIndex, "type", e.target.value)
                  }
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                >
                  {scenarioTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <div className="mb-2 relative">
                  <input
                    type="text"
                    value={scenario.name}
                    onChange={(e) =>
                      handleScenarioChange(
                        scenarioIndex,
                        "name",
                        e.target.value
                      )
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 pr-8 text-gray-700"
                    required
                  />
                  {scenario.name.includes("{") &&
                    scenario.name.includes("}") && (
                      <span
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500 text-sm cursor-help"
                        title="Please replace placeholders in {} with actual values"
                      >
                        ⚠️
                      </span>
                    )}
                </div>

                {/* Scenario Name Templates Dropdown */}
                <div className="mb-2">
                  {(() => {
                    let dropdownPlaceholder = "Choose a scenario template...";
                    let helperText =
                      "Template will replace the current scenario name";
                    if (scenario.type === "Background") {
                      dropdownPlaceholder = "Choose a background template...";
                      helperText =
                        "Template will replace the current background name";
                    } else if (scenario.type === "Scenario Outline") {
                      dropdownPlaceholder =
                        "Choose a scenario outline template...";
                      helperText =
                        "Template will replace the current scenario outline name";
                    }
                    return (
                      <>
                        <select
                          className="border border-blue-200 rounded-lg px-2 py-2 bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 w-full"
                          onChange={(e) => {
                            if (e.target.value) {
                              const template = e.target.value;
                              const appliedName =
                                applyScenarioNameTemplate(template);
                              handleScenarioChange(
                                scenarioIndex,
                                "name",
                                appliedName
                              );
                              e.target.value = ""; // Reset dropdown
                              // Focus the input after applying template
                              setTimeout(() => {
                                const input =
                                  e.target.parentElement.parentElement.parentElement.querySelector(
                                    "input"
                                  );
                                if (input) input.focus();
                              }, 100);
                            }
                          }}
                        >
                          <option value="">{dropdownPlaceholder}</option>
                          <optgroup label="API Testing">
                            {scenarioNameTemplates.api.map((template, idx) => (
                              <option key={"api-" + idx} value={template}>
                                {template}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Kafka">
                            {scenarioNameTemplates.kafka.map(
                              (template, idx) => (
                                <option key={"kafka-" + idx} value={template}>
                                  {template}
                                </option>
                              )
                            )}
                          </optgroup>
                          <optgroup label="Functional">
                            {scenarioNameTemplates.others.map(
                              (template, idx) => (
                                <option
                                  key={"functional-" + idx}
                                  value={template}
                                >
                                  {template}
                                </option>
                              )
                            )}
                          </optgroup>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          {helperText}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-blue-700 text-base font-bold mb-2 tracking-wide">
                  Steps
                </label>
                {scenario.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="mb-3">
                    <div className="flex gap-2 mb-2 items-center">
                      <select
                        value={step.keyword}
                        onChange={(e) =>
                          handleStepChange(
                            scenarioIndex,
                            stepIndex,
                            "keyword",
                            e.target.value
                          )
                        }
                        className="border border-blue-200 rounded-lg px-2 py-2 bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      >
                        {cucumberKeywords.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={step.text}
                          onChange={(e) =>
                            handleStepChange(
                              scenarioIndex,
                              stepIndex,
                              "text",
                              e.target.value
                            )
                          }
                          className="w-full shadow appearance-none border border-blue-200 rounded-lg py-3 px-4 pr-8 text-gray-700 bg-gradient-to-r from-white via-blue-50 to-white focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                          required
                          placeholder={`Step ${stepIndex + 1}`}
                        />
                        {step.text.includes("{") && step.text.includes("}") && (
                          <span
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500 text-sm cursor-help"
                            title="Please replace placeholders in {} with actual values"
                          >
                            ⚠️
                          </span>
                        )}
                      </div>
                      {scenario.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(scenarioIndex, stepIndex)}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-red-400 via-pink-300 to-red-400 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 border border-red-200"
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

                    {/* Step Templates Dropdown */}
                    <div className="ml-0 mb-2">
                      <select
                        className="border border-blue-200 rounded-lg px-2 py-2 bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 w-full"
                        onChange={(e) => {
                          if (e.target.value) {
                            const template = e.target.value;
                            const appliedText = applyStepTemplate(
                              template,
                              step.keyword
                            );
                            handleStepChange(
                              scenarioIndex,
                              stepIndex,
                              "text",
                              appliedText
                            );
                            e.target.value = ""; // Reset dropdown
                            // Focus the step input after applying template
                            setTimeout(() => {
                              const stepInput =
                                e.target.parentElement.parentElement.parentElement.querySelector(
                                  'input[type="text"]'
                                );
                              if (stepInput) stepInput.focus();
                            }, 100);
                          }
                        }}
                      >
                        <option value="">Choose a step template...</option>
                        {(() => {
                          // And zinciri için bir önceki And olmayan keyword'ü bul
                          let keywordForTemplates = step.keyword;
                          if (step.keyword === "And" && stepIndex > 0) {
                            let prevIndex = stepIndex - 1;
                            while (
                              prevIndex >= 0 &&
                              scenario.steps[prevIndex].keyword === "And"
                            ) {
                              prevIndex--;
                            }
                            if (prevIndex >= 0) {
                              keywordForTemplates =
                                scenario.steps[prevIndex].keyword;
                            }
                          }
                          return (
                            <>
                              <optgroup label="API Testing">
                                {stepTemplates[keywordForTemplates]
                                  ?.filter(
                                    (t) =>
                                      t.toLowerCase().includes("api") ||
                                      t.toLowerCase().includes("endpoint") ||
                                      t.toLowerCase().includes("request") ||
                                      t.toLowerCase().includes("response") ||
                                      t.toLowerCase().includes("header") ||
                                      t.toLowerCase().includes("token") ||
                                      t
                                        .toLowerCase()
                                        .includes("authentication") ||
                                      t
                                        .toLowerCase()
                                        .includes("authorization") ||
                                      t.toLowerCase().includes("schema") ||
                                      t.toLowerCase().includes("status code") ||
                                      t.toLowerCase().includes("rate limit")
                                  )
                                  .map((template, idx) => (
                                    <option key={"api-" + idx} value={template}>
                                      {template}
                                    </option>
                                  ))}
                              </optgroup>
                              <optgroup label="Kafka">
                                {stepTemplates[keywordForTemplates]
                                  ?.filter(
                                    (t) =>
                                      t.toLowerCase().includes("kafka") ||
                                      t.toLowerCase().includes("topic") ||
                                      t.toLowerCase().includes("consumer") ||
                                      t.toLowerCase().includes("producer") ||
                                      t.toLowerCase().includes("broker") ||
                                      t
                                        .toLowerCase()
                                        .includes("schema registry") ||
                                      t.toLowerCase().includes("offset") ||
                                      t.toLowerCase().includes("message") ||
                                      t.toLowerCase().includes("partition") ||
                                      t.toLowerCase().includes("dead letter")
                                  )
                                  .map((template, idx) => (
                                    <option
                                      key={"kafka-" + idx}
                                      value={template}
                                    >
                                      {template}
                                    </option>
                                  ))}
                              </optgroup>
                              <optgroup label="Functional">
                                {stepTemplates[keywordForTemplates]
                                  ?.filter(
                                    (t) =>
                                      !(
                                        t.toLowerCase().includes("api") ||
                                        t.toLowerCase().includes("endpoint") ||
                                        t.toLowerCase().includes("request") ||
                                        t.toLowerCase().includes("response") ||
                                        t.toLowerCase().includes("header") ||
                                        t.toLowerCase().includes("token") ||
                                        t
                                          .toLowerCase()
                                          .includes("authentication") ||
                                        t
                                          .toLowerCase()
                                          .includes("authorization") ||
                                        t.toLowerCase().includes("schema") ||
                                        t
                                          .toLowerCase()
                                          .includes("status code") ||
                                        t
                                          .toLowerCase()
                                          .includes("rate limit") ||
                                        t.toLowerCase().includes("kafka") ||
                                        t.toLowerCase().includes("topic") ||
                                        t.toLowerCase().includes("consumer") ||
                                        t.toLowerCase().includes("producer") ||
                                        t.toLowerCase().includes("broker") ||
                                        t
                                          .toLowerCase()
                                          .includes("schema registry") ||
                                        t.toLowerCase().includes("offset") ||
                                        t.toLowerCase().includes("message") ||
                                        t.toLowerCase().includes("partition") ||
                                        t.toLowerCase().includes("dead letter")
                                      )
                                  )
                                  .map((template, idx) => (
                                    <option
                                      key={"functional-" + idx}
                                      value={template}
                                    >
                                      {template}
                                    </option>
                                  ))}
                              </optgroup>
                            </>
                          );
                        })()}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Template will replace the current step text
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addStep(scenarioIndex)}
                  className="text-base font-semibold text-blue-700 bg-gradient-to-r from-blue-100 via-green-50 to-blue-100 px-4 py-2 rounded-xl shadow border border-blue-200 hover:scale-105 hover:shadow-xl transition-all duration-200 mt-2"
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
                                onChange={(e) =>
                                  handleExampleHeaderChange(
                                    scenarioIndex,
                                    e.target.value,
                                    index
                                  )
                                }
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
                                  onChange={(e) =>
                                    handleExampleRowChange(
                                      scenarioIndex,
                                      rowIndex,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Value"
                                  className="w-full p-1"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan={scenario.examples.headers.length + 1}
                            className="border p-2"
                          >
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

        {/* Show Add New Scenario button always, but only show scenarios if present */}
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
            onClick={saveToLocalStorageWithNotification}
            className="button-85 yellow flex-1 order-1"
          >
            Save as Draft
          </button>
          <button type="submit" className="button-85 green flex-1 order-2">
            Download  </button>
        </div>
        <div className="flex gap-4 mb-4">
          {/* Clear Form button moved to top right, removed from here */}
        </div>
      </form>
    </div>
  );
}

export default FeatureForm;
