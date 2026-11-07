Feature: The Google Drive plugin
  Once the plugin is activated and installed, the workspaces it applies to carry a Sync to Drive
  button in their rail, and the Plugins page lists the plugin with its four steps.

  Scenario: The docs workspace offers Sync to Drive
    Given I am on "/docs"
     Then I should see "Sync to Drive"

  Scenario: The plugin is listed on the Plugins page
    Given I am on "/settings/plugins"
     Then I should see "Google Drive"
      And I should see "@webship/workspace-google-drive"
