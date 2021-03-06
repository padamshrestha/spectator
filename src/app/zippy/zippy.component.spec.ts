import { ZippyComponent } from "./zippy.component";
import {
  createHostComponentFactory,
  SpectatorWithHost
} from "../../lib/src/host";
import { Component } from "@angular/core";
import { fakeAsync, tick } from "@angular/core/testing";

describe("ZippyComponent", () => {
  let host: SpectatorWithHost<ZippyComponent>;

  const createHost = createHostComponentFactory(ZippyComponent);

  it("should display the title", () => {
    host = createHost(`<zippy title="Zippy title"></zippy>`);

    expect(host.query(".zippy__title")).toHaveText(text => "Zippy title");
  });

  it("should have attribute", () => {
    host = createHost(`<zippy title="Zippy title">Zippy content</zippy>`);

    expect(host.query(".zippy")).toHaveAttr({ attr: "id", val: "zippy" });
  });

  it("should be checked", () => {
    host = createHost(`<zippy title="Zippy title">Zippy content</zippy>`);

    expect(host.query(".checkbox")).toHaveProp({ prop: "checked", val: true });
  });

  it("should display the content", () => {
    host = createHost(`<zippy title="Zippy title">Zippy content</zippy>`);

    host.click(".zippy__title");

    expect(host.query(".zippy__content")).toHaveText("Zippy content");
  });

  it('should display the "Open" word if closed', () => {
    host = createHost(`<zippy title="Zippy title">Zippy content</zippy>`);

    expect(host.query(".arrow")).toHaveText("Open");
    expect(host.query(".arrow")).not.toHaveText("Close");
  });

  it('should display the "Close" word if open', () => {
    host = createHost(`<zippy title="Zippy title">Zippy content</zippy>`);

    host.click(".zippy__title");

    expect(host.query(".arrow")).toHaveText("Close");
    expect(host.query(".arrow")).not.toHaveText("Open");
  });

  it("should be closed by default", () => {
    host = createHost(`<zippy title="Zippy title"></zippy>`);

    expect(".zippy__content").not.toExist();
  });

  it("should toggle the content", () => {
    host = createHost(`<zippy title="Zippy title"></zippy>`);

    host.click(".zippy__title");
    expect(host.query(".zippy__content")).toExist();

    host.click(".zippy__title");
    expect(".zippy__content").not.toExist();
  });
});

@Component({ selector: "custom-host", template: "" })
class CustomHostComponent {
  title = "Custom HostComponent";
}

describe("With Custom Host Component", function() {
  let host: SpectatorWithHost<ZippyComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: ZippyComponent,
    host: CustomHostComponent
  });

  it("should display the host component title", () => {
    host = createHost(`<zippy [title]="title"></zippy>`);

    expect(host.query(".zippy__title")).toHaveText("Custom HostComponent");
  });

  it(
    "should work with tick",
    fakeAsync(() => {
      host = createHost(`<zippy [title]="title"></zippy>`);
      host.component.update();
      expect(host.component.updatedAsync).toBeFalsy();
      tick(6000);
      expect(host.component.updatedAsync).not.toBeFalsy();
    })
  );
});
