import { expect, test } from "vitest";
import { makeChatTreeStore } from "./makeChatTreeStore.ts";
import { ChatTreeState } from "./chatTreeState.ts";
import { StoreApi } from "zustand";
import { ChatTreeLeaf } from "./chatTreeLeaf.ts";
import { ChatTreeBranch } from "./chatTreeBranch.ts";

function useMockChatTreeStore() {
  const state = makeChatTreeStore(
    set,
    get,
    undefined as unknown as StoreApi<ChatTreeState>,
  );

  function set(what: Partial<ChatTreeState>) {
    Object.assign(state, what);
  }

  function get(): ChatTreeState {
    return state;
  }

  return state;
}

test("Can set root branch", () => {
  const blurb = useMockChatTreeStore();

  blurb.setRootBranch("model", {
    id: "dummy",
    created: Date.now().valueOf(),
    elements: [],
    branchId: "dummy1",
    branchName: "Test",
  });

  expect(blurb.rootBranch).toBeDefined();
  expect(blurb.rootBranch?.branchName).toEqual("Test");
});

test("Can create leaf", () => {
  const blurb = useMockChatTreeStore();

  blurb.setRootBranch("model", {
    id: "dummy",
    created: Date.now().valueOf(),
    elements: [],
    branchId: "dummy1",
    branchName: "Test",
  });

  const originalRootBranch = blurb.rootBranch;

  const leaf: ChatTreeLeaf = {
    id: "id1",
    created: Date.now().valueOf(),
    chatName: "Chatname",
  };

  blurb.addNode(blurb.rootBranch!, leaf);

  expect(blurb.rootBranch).not.eq(originalRootBranch);
  expect(blurb.rootBranch).toBeDefined();
  expect(blurb.rootBranch?.elements.length).eq(1);
  expect(blurb.rootBranch?.elements[0].id).eq("id1");
});

test("Can create branch", () => {
  const blurb = useMockChatTreeStore();

  blurb.setRootBranch("model", {
    id: "dummy",
    created: Date.now().valueOf(),
    elements: [],
    branchId: "dummy1",
    branchName: "Test",
  });

  const branch: ChatTreeBranch = {
    id: "id1",
    created: Date.now().valueOf(),
    branchName: "Branch",
    branchId: "branchId1",
    elements: [],
  };

  blurb.addNode(blurb.rootBranch!, branch);

  expect(blurb.rootBranch).toBeDefined();
  expect(blurb.rootBranch?.elements.length).eq(1);
  expect((blurb.rootBranch?.elements[0] as ChatTreeBranch).branchId).eq(
    "branchId1",
  );
});

test("Can replace leaf with another leaf", () => {
  const blurb = useMockChatTreeStore();

  blurb.setRootBranch("model", {
    id: "dummy",
    created: Date.now().valueOf(),
    elements: [],
    branchId: "dummy1",
    branchName: "Test",
  });

  const leaf1: ChatTreeLeaf = {
    id: "id1",
    created: Date.now().valueOf(),
    chatName: "Chatname",
  };

  blurb.addNode(blurb.rootBranch!, leaf1);

  const leaf2: ChatTreeLeaf = {
    id: "id2",
    created: Date.now().valueOf(),
    chatName: "Chatname2",
  };

  blurb.replaceNode(leaf1, leaf2);

  expect(blurb.rootBranch).toBeDefined();
  expect(blurb.rootBranch?.elements.length).eq(1);
  expect((blurb.rootBranch?.elements[0] as ChatTreeLeaf).chatName).eq(
    "Chatname2",
  );
});

test("Can replace leaf with branch", () => {
  const blurb = useMockChatTreeStore();

  blurb.setRootBranch("model", {
    id: "dummy",
    created: Date.now().valueOf(),
    elements: [],
    branchId: "dummy1",
    branchName: "Test",
  });

  const leaf1: ChatTreeLeaf = {
    id: "id1",
    created: Date.now().valueOf(),
    chatName: "Chatname",
  };

  blurb.addNode(blurb.rootBranch!, leaf1);

  const branch: ChatTreeBranch = {
    id: "id2",
    created: Date.now().valueOf(),
    branchId: "branchId1",
    branchName: "Sub-branch",
    elements: [leaf1],
  };

  blurb.replaceNode(leaf1, branch);

  expect(blurb.rootBranch).toBeDefined();
  expect(blurb.rootBranch?.elements.length).eq(1);
  expect((blurb.rootBranch?.elements[0] as ChatTreeBranch).branchId).eq(
    "branchId1",
  );
  expect((blurb.rootBranch?.elements[0] as ChatTreeBranch).elements.length).eq(
    1,
  );
});
