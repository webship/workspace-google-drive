Feature: The Google Drive plugin
  Once the plugin is activated and installed, the workspaces it applies to carry a Sync to Drive
  button in their rail, and the Plugins page lists the plugin with its four steps.

  Scenario: The docs workspace offers Sync to Drive
    Given I am on "/docs"
     Then I should see "Sync to Drive"

  Scenario: The plugin is listed on the Plugins page
    Given I am on "/settings/plugins"
     Then I should see "Google Drive"
      And I should see "@webship.co/workspace-google-drive"

  Scenario: The AI Agents folder lists the agent the plugin ships
    Given I am on "/ai-agents"
     Then I should see "google-drive-pusher"

  Scenario: The AI Skills folder lists the skill the plugin ships
    Given I am on "/ai-skills"
     Then I should see "google-drive-push"

  Scenario: The AI Commands folder lists the command the plugin ships
    Given I am on "/ai-commands"
     Then I should see "google-drive-preview"

  Scenario: The AI Prompts folder lists the prompt the plugin ships
    Given I am on "/ai-prompts"
     Then I should see "google-drive-push-folder"
