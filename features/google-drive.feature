Feature: The Google Drive plugin
  Once the plugin is activated and installed, the workspaces it applies to carry a Sync to Drive
  button in their rail, and the Plugins page lists the plugin with its four steps.

  Scenario: The docs workspace offers Sync to Drive
    Given I am on "/docs"
     Then I should see "Sync to Drive"

  # The Plugins page names each plugin; the package is on the plugin's own page (the row shows it on hover only).
  Scenario: The plugin is listed on the Plugins page, and its own page names its package
    Given I am on "/settings/plugins"
     Then I should see "Google Drive"
     When I go to "/settings/plugin/google-drive-sync"
     Then I should see "@webship.co/workspace-google-drive"

  # The AI folders are searched by name: with every plugin on, a folder lists more than one page of items.
  Scenario: The AI Agents folder lists the agent the plugin ships
    Given I am on "/ai-agents?q=google-drive-pusher"
     Then I should see "google-drive-pusher"

  Scenario: The AI Skills folder lists the skill the plugin ships
    Given I am on "/ai-skills?q=google-drive-push"
     Then I should see "google-drive-push"

  Scenario: The AI Commands folder lists the command the plugin ships
    Given I am on "/ai-commands?q=google-drive-preview"
     Then I should see "google-drive-preview"

  Scenario: The AI Prompts folder lists the prompt the plugin ships
    Given I am on "/ai-prompts?q=google-drive-push-folder"
     Then I should see "google-drive-push-folder"
