# Plan Execution Workflow: Subagent-Driven Standard

## Mandatory Execution Mode
Whenever an implementation plan is created and approved for execution:
1. **Always use Subagent-Driven Development (`superpowers:subagent-driven-development`)**:
   - Dispatch a fresh, dedicated subagent per task.
   - Run two-stage reviews (spec review & quality review) between tasks.
   - Do not prompt the user to choose between Inline vs Subagent-Driven execution unless the user explicitly asks for execution options.
2. **Autonomous Hand-off**:
   - Once the user approves the implementation plan, immediately proceed using `superpowers:subagent-driven-development` without redundant selection hurdles.
