import { describe, expect, it } from "vitest";
import { canAccess } from "@/lib/auth";

describe("accès par rôle", () => {
  it("seul l’enseignant ouvre l’espace enseignant", () => {
    expect(canAccess("teacher", "/enseignant")).toBe(true);
    expect(canAccess("student", "/enseignant")).toBe(false);
  });
  it("seul le super admin ouvre l’administration", () => {
    expect(canAccess("super_admin", "/administration")).toBe(true);
    expect(canAccess("teacher", "/administration")).toBe(false);
  });
  it("tout le monde accède aux publications et messages", () => {
    expect(canAccess("student", "/publications")).toBe(true);
    expect(canAccess("teacher", "/messages")).toBe(true);
  });
});
