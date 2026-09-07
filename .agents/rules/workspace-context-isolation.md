# Workspace Context Isolation Rule

## Rule: Always Scope Conversation History to the Active Workspace

When the user asks questions like "what did we do last?", "what was our
last task?", "recap our recent work", or any variation of recalling past
activity, you MUST:

1. **Identify the active workspace** from the current session metadata
   (the workspace URI and CorpusName shown in `<user_information>`).

2. **Filter conversation history** — only surface conversations that are
   clearly related to the active workspace. Discard conversations from
   unrelated projects, workspaces, or domains.

3. **Do NOT present a mixed cross-workspace history** as if it were a
   single unified timeline. Different workspaces are different projects
   and should be treated as isolated contexts.

4. **When in doubt** about whether a past conversation belongs to the
   current workspace, err on the side of omitting it rather than
   including it.

## Example of Correct Behavior

Active workspace: `nexcomarch`

✅ Include: Conversations referencing `localhost:3001`, nexCommerce PRs,
   storefront components, NestJS APIs related to this project.

❌ Exclude: Batch processing jobs, Shwapno storefront tests, unrelated
   marketing automation — even if they appeared in the same session day.
