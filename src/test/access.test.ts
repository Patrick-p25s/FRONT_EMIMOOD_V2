import { describe, expect, it } from "vitest";
import { canAccess } from "@/lib/auth";
import { normalizeList, safeNext } from "@/lib/api/list";

describe("accès par rôle", () => {
  it("seul l’enseignant ouvre l’espace enseignant", () => {
    expect(canAccess("teacher", "/enseignant")).toBe(true);
    expect(canAccess("student", "/enseignant")).toBe(false);
  });
  it("seul le super admin ouvre /admin et ses sous-pages", () => {
    expect(canAccess("super_admin", "/admin")).toBe(true);
    expect(canAccess("super_admin", "/admin/classes")).toBe(true);
    expect(canAccess("teacher", "/admin")).toBe(false);
    expect(canAccess("student", "/admin/users")).toBe(false);
  });
  it("tout le monde accède aux publications et messages", () => {
    expect(canAccess("student", "/publications")).toBe(true);
    expect(canAccess("teacher", "/messages")).toBe(true);
  });
});

describe("redirection après connexion", () => {
  it("ignore un next externe", () => {
    expect(safeNext("https://autre-site.com")).toBeNull();
    expect(safeNext("//autre-site.com")).toBeNull();
    expect(safeNext("/admin/classes?u=1")).toBe("/admin/classes?u=1");
  });
});

describe("listes", () => {
  it("accepte un simple tableau", () => {
    expect(normalizeList([1, 2, 3])).toMatchObject({ total: 3, pages: 1 });
  });
});
