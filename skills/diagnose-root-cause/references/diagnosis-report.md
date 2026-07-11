# Diagnosis report template

## Conclusion

**Cause:** <earliest incorrect transition>

**Confidence:** <high/medium/low> — <why>

**Blast radius:** <affected inputs, paths, versions, or environments>

## Expected vs observed

- **Expected:** falsifiable behavior or invariant.
- **Observed:** exact divergence and evidence reference.

## Causal chain

`trigger → violated invariant → bad state/value → propagation → symptom`

Cite the enforcement/transition points with `path:line`, trace IDs, or commands.

## Decisive evidence

| Experiment/observation | Prediction | Result | Interpretation |
|---|---|---|---|
| | | | |

## Alternatives eliminated

List plausible alternatives and the evidence that contradicts each. Do not list
straw hypotheses.

## Fix boundary and regression proof

- **Smallest coherent fix:** location and invariant to restore.
- **Regression test:** input that fails before and passes after.
- **Adjacent risk:** sibling paths or compatibility constraints to verify.

## Remaining uncertainty

State the exact missing evidence and next discriminating experiment.
