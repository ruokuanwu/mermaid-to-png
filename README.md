# mermaid-to-png

Export Mermaid diagrams to PNG in VS Code with one click, powered by `mmdc` (Mermaid CLI).

## Features

- Export `.mmd` files to PNG from the context menu
- Export selected Mermaid text from any editor to PNG
- Batch export all ` ```mermaid ` code blocks in a Markdown file
- Configure theme, background color, scale, and output directory
- Automatically strip Markdown code fences when exporting selections

## Requirements

[Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) must be installed and accessible.

Recommended global install:

```sh
npm install -g @mermaid-js/mermaid-cli
```

The default setting is `mermaid-to-png.mmdcPath = "mmdc"`.

You can also set a custom command or path, for example: `npx mmdc` or `/usr/local/bin/mmdc`.

## Install the Extension

Install from the VS Code Marketplace, or side-load a `.vsix` package:

```sh
code --install-extension mermaid-to-png-*.vsix --force
```

## Usage

### 1. Export a `.mmd` file

Right-click a `.mmd` file in the Explorer or editor, then select:

**Mermaid: Export Mermaid Diagrams to PNG**

By default, the PNG is generated in the same directory as the source file.

### 2. Export selected Mermaid text

1. Select Mermaid text in any editor
2. Right-click and choose **Mermaid: Export Mermaid Diagrams to PNG**

If the selection includes fenced code blocks like ` ```mermaid ... ``` `, fences are removed automatically before rendering.

### 3. Export a Markdown file

Right-click a `.md` file in the Explorer or editor, then select:

**Mermaid: Export Mermaid Diagrams to PNG**

Each Mermaid code block in the file is exported as an individual PNG.

## Output Naming and Directory Rules

### `.mmd` export

- `diagram.mmd` -> `diagram.png`

### Selection export

- If the source is a saved file: use the source file name as the base output name
- If the target name already exists: append `_1`, `_2`, ...
- If the source is untitled/virtual: fall back to `diagram.png`

### Output directory

- If `mermaid-to-png.outputDir` is empty: output next to the source file
- If `outputDir` is relative: resolve it from the source file's directory

## Configuration

Open VS Code Settings and search for `mermaid-to-png`.

| Setting | Type | Default | Description |
|---|---|---|---|
| `mermaid-to-png.mmdcPath` | `string` | `mmdc` | Executable command or path for `mmdc` |
| `mermaid-to-png.outputDir` | `string` | `""` | Output directory; empty means same directory as source |
| `mermaid-to-png.theme` | `string` | `default` | Mermaid theme: `default`, `dark`, `forest`, `neutral` |
| `mermaid-to-png.background` | `string` | `white` | PNG background color, e.g. `white`, `transparent`, `#ffffff` |
| `mermaid-to-png.scale` | `number` | `2` | Scale multiplier (1-8); higher is sharper but larger |

### Image clarity guide

| Use case | Recommended `scale` |
|---|---|
| Docs / screenshots | `2` |
| Presentation slides | `3` |
| Print assets | `4` |

## Commands

- `mermaid-to-png.exportSelection`
  - Title: `Mermaid: Export Mermaid Diagrams to PNG`
  - Context: editor context menu (when text is selected)

- `mermaid-to-png.exportFile`
  - Title: `Mermaid: Export Mermaid Diagrams to PNG`
  - Context: `.mmd` files (editor/explorer)

- `mermaid-to-png.exportMarkdown`
  - Title: `Mermaid: Export Mermaid Diagrams to PNG`
  - Context: `.md` files (editor/explorer)

## Troubleshooting

### "Cannot find `mmdc`"

1. Install Mermaid CLI:

```sh
npm install -g @mermaid-js/mermaid-cli
```

2. Verify that `mermaid-to-png.mmdcPath` is set correctly.

### Export fails due to Mermaid syntax errors

Validate the same input via CLI first:

```sh
mmdc -i input.mmd -o output.png
```

### PNG output path is not as expected

- Check `mermaid-to-png.outputDir`
- Relative paths are resolved from the source file's directory

## Development

```sh
# Install dependencies
pnpm install

# Compile
pnpm run compile

# Watch
pnpm run watch

# Package .vsix
pnpm run package
```

Press `F5` in VS Code to launch the Extension Development Host for debugging.

## License

MIT
