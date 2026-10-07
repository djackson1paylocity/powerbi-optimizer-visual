# Optimizer Visual for Power BI

This repository contains a custom Power BI visual inspired by the product breakdown mockup shown in the provided reference image. It creates a radial, network-style layout with:

- a dark navy center summary node
- pastel circular category nodes around the center
- connecting lines between the center and each node
- percentage labels and light neutral canvas styling

## Quick start

```bash
npm install
npm run start
```

To package the visual for import into Power BI:

```bash
npm run package
```

The generated `.pbiviz` file can then be imported into Power BI Desktop.

## Notes

This implementation is intentionally styled to match the supplied mockup closely for visual design purposes. It can also be adapted to real Power BI fields later if you want to bind the labels and values to your data model.
