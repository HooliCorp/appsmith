import { WIDGET } from "../../../../locators/WidgetLocators";
import { ObjectsRegistry } from "../../../../support/Objects/Registry";
const {
  AggregateHelper: agHelper,
  CommonLocators: locator,
  EntityExplorer: ee,
  LibraryInstaller: installer,
  PropertyPane: propPane,
} = ObjectsRegistry;

describe("Autocomplete bug fixes", function () {
  it("1. Bug #12790 Verifies if selectedRow is in best match", function () {
    ee.DragDropWidgetNVerify(WIDGET.TABLE, 200, 200);
    ee.DragDropWidgetNVerify(WIDGET.TEXT, 200, 600);
    ee.SelectEntityByName("Text1");
    propPane.TypeTextIntoField("Text", "{{Table1.");
    agHelper.AssertElementExist(locator._hints);
    agHelper.GetNAssertElementText(locator._hints, "Best Match");
    agHelper.GetNAssertElementText(
      locator._hints,
      "selectedRow",
      "have.text",
      1,
    );
  });

  it("2. Bug #13983 Verifies if object properties are in autocomplete list", function () {
    ee.SelectEntityByName("Text1");
    propPane.TypeTextIntoField("Text", '{{Table1.selectedRow["');
    agHelper.AssertElementExist(locator._hints);
    agHelper.GetNAssertElementText(locator._hints, "status", "contain.text");

    propPane.TypeTextIntoField("Text", "{{Table1.selectedRow['");
    agHelper.AssertElementExist(locator._hints);
    agHelper.GetNAssertElementText(locator._hints, "status", "contain.text");
  });

  it("3. Bug #13983 Verifies if object properties are in autocomplete list", function () {
    ee.SelectEntityByName("Text1");
    propPane.TypeTextIntoField("Text", '{{Table1.selectedRo"');
    agHelper.AssertElementAbsence(locator._hints);

    propPane.TypeTextIntoField("Text", '{{"');
    agHelper.AssertElementAbsence(locator._hints);
  });

  it("4. Bug #14990 Checks if copied widget show up on autocomplete suggestions", function () {
    ee.CopyPasteWidget("Text1");
    ee.SelectEntityByName("Text1");
    propPane.UpdatePropertyFieldValue("Text", "");
    propPane.TypeTextIntoField("Text", "{{Te");
    agHelper.AssertElementExist(locator._hints);
    agHelper.GetNAssertElementText(locator._hints, "Best Match");
    agHelper.GetNAssertElementText(
      locator._hints,
      "Text1Copy.text",
      "have.text",
      1,
    );
  });

  it("5. Bug #14100 Custom columns name label change should reflect in autocomplete", function () {
    // select table widget
    ee.SelectEntityByName("Table1");
    // add new column
    cy.get(".t--add-column-btn").click();
    // edit column name
    cy.get(
      "[data-rbd-draggable-id='customColumn1'] .t--edit-column-btn",
    ).click();

    propPane.UpdatePropertyFieldValue("Property Name", "columnAlias");
    cy.wait(500);
    // select text widget
    ee.SelectEntityByName("Text1");

    // type {{Table1.selectedRow. and check for autocompletion suggestion having edited column name
    propPane.TypeTextIntoField("Text", "{{Table1.selectedRow.");
    agHelper.GetNAssertElementText(
      locator._hints,
      "columnAlias",
      "have.text",
      0,
    );
  });

  it("6. feat #16426 Autocomplete for fast-xml-parser", function () {
    ee.SelectEntityByName("Text1");
    propPane.TypeTextIntoField("Text", "{{xmlParser.j");
    agHelper.GetNAssertElementText(locator._hints, "j2xParser");

    propPane.TypeTextIntoField("Text", "{{new xmlParser.j2xParser().p");
    agHelper.GetNAssertElementText(locator._hints, "parse");
  });

  it("7. Installed library should show up in autocomplete", function () {
    ee.ExpandCollapseEntity("Libraries");
    installer.openInstaller();
    installer.installLibrary("uuidjs", "UUID");
    installer.closeInstaller();
    ee.SelectEntityByName("Text1");
    propPane.TypeTextIntoField("Text", "{{UUI");
    agHelper.GetNAssertElementText(locator._hints, "UUID");
  });

  it("8. No autocomplete for Removed libraries", function () {
    ee.RenameEntityFromExplorer("Text1Copy", "UUIDTEXT");
    installer.uninstallLibrary("uuidjs");
    propPane.TypeTextIntoField("Text", "{{UUID.");
    agHelper.AssertElementAbsence(locator._hints);
  });
});
