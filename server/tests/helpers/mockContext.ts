// tests/helpers/mockContext.ts
export function createMockContext({
  params = {},
  userId,
  body = {},
}: {
  params?: Record<string, string>;
  userId: number;
  body?: any; // ✅ antes decía `body: any;`
}) {
  const mockBody = {
    value: body,
    type: "json",
    json: async () => body,
  };

  const ctx = {
    params,
    state: { userId },
    request: {
      body: () => mockBody,
      url: new URL("http://localhost"),
    },
    response: {
      status: 0,
      body: undefined,
    },
    throw: (status: number, message: string) => {
      const err = new Error(message);
      (err as any).status = status;
      throw err;
    },
  };

  return ctx as any;
}
