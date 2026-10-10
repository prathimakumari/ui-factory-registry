// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button, FormField, Input, Select, Switch } from "../components/ui/primitives";
import { resolveDesign } from "../lib/registry";
import { exportConfiguration } from "../lib/export";
import { designAgentPrompt } from "../lib/agent-prompt";
import { sourceClosure } from "../scripts/source-graph";
afterEach(cleanup);
describe("portable controls and layout", () => {
  it("does not accidentally submit forms but permits explicit submit buttons", () => {
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const action = vi.fn();
    render(
      <form onSubmit={submit}>
        <Button onClick={action}>Action</Button>
        <Button type="submit">Save</Button>
        <Button disabled onClick={action}>
          Disabled
        </Button>
      </form>,
    );
    fireEvent.click(screen.getByText("Action"));
    expect(action).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Disabled"));
    expect(action).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Save"));
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("preserves supplied select and switch IDs for accessible labels", () => {
    render(
      <>
        <Select id="project" label="Project" options={[{ label: "First", value: "first" }]} />
        <Switch id="alerts" label="Alerts" />
      </>,
    );
    expect(screen.getByLabelText("Project").id).toBe("project");
    expect(screen.getByLabelText("Alerts").id).toBe("alerts");
  });
  it("preserves help descriptions and announces field errors", () => {
    const { rerender } = render(
      <>
        <span id="help">Use your work email.</span>
        <FormField label="Email" error="Enter a valid email.">
          <Input id="email" aria-describedby="help" />
        </FormField>
      </>,
    );
    expect(screen.getByLabelText("Email").getAttribute("aria-describedby")).toBe(
      "help email-error",
    );
    expect(screen.getByRole("alert").textContent).toBe("Enter a valid email.");
    rerender(
      <FormField label="Email">
        <Input id="email" aria-describedby="help" />
      </FormField>,
    );
    expect(screen.getByLabelText("Email").getAttribute("aria-describedby")).toBe("help");
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).not.toBe("true");
  });
  it("keeps layout dimensions through export and agent prompts", () => {
    const config = {
      template: "saas-landing-01",
      layout: { contentWidth: 880, density: 0.8, radius: 18 },
    };
    const exported = exportConfiguration(config);
    expect(JSON.parse(exported.content).layout).toEqual(config.layout);
    expect(exportConfiguration(JSON.parse(exported.content)).content).toBe(exported.content);
    expect(designAgentPrompt(config)).toContain('"contentWidth": 880');
    expect(designAgentPrompt(config)).toContain("embedded={true}");
  });
  it.each([{ contentWidth: 100 }, { density: -1 }, { radius: 80 }, { arbitrary: true }])(
    "rejects unsafe layout values: %o",
    (layout) => {
      expect(() => resolveDesign({ template: "saas-landing-01", layout })).toThrow();
    },
  );
  it("ships locally imported effect styles in copied source closures", () => {
    expect(sourceClosure(["styles/globals.css"])).toContain("styles/effects.css");
  });
});
