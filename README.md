# Mermaid to PNG

Export Mermaid diagrams to PNG in VS Code using `mmdc` (`@mermaid-js/mermaid-cli`).

This extension supports:
- Exporting an entire `.mmd` file to PNG
- Exporting selected Mermaid code from any editor to PNG
- Configurable rendering options (theme, background, output dir)
- High-clarity export via configurable image scale

## Features

### 1) Export `.mmd` file to PNG
- In Explorer: right-click a `.mmd` file and run **Mermaid: Export as PNG**
- In editor: when current file is `.mmd` and no selection, right-click and run **Mermaid: Export as PNG**

### 2) Export selected Mermaid code to PNG
- Select Mermaid diagram text in editor
- Right-click and run **Mermaid: Export as PNG**
- If selection is fenced markdown block like:

````markdown
```mermaid
graph TD
  A --> B
```
````

The fence is stripped automatically before export.

## Requirements

You must have Mermaid CLI installed and accessible by the extension.

### Option A: Global install (recommended)

```bash
npm install -g @mermaid-js/mermaid-cli
```

Then keep default setting:
- `mermaid-to-png.mmdcPath = "mmdc"`

### Option B: Custom command/path

Set `mermaid-to-png.mmdcPath` to a command string, for example:
- `npx mmdc`
- `/usr/local/bin/mmdc`

## Configuration

Open VS Code Settings and search for `mermaid-to-png`.

### `mermaid-to-png.mmdcPath`
- Type: `string`
- Default: `mmdc`
- Description: Path or command for Mermaid CLI executable.

### `mermaid-to-png.outputDir`
- Type: `string`
- Default: empty (`""`)
- Description: Output directory for PNG files.
- Behavior:
  - Empty: output beside source file
  - Relative path: resolved relative to source file directory
  - Absolute path: used directly

### `mermaid-to-png.theme`
- Type: `string`
- Default: `default`
- Allowed: `default`, `dark`, `forest`, `neutral`

### `mermaid-to-png.background`
- Type: `string`
- Default: `white`
- Examples: `white`, `transparent`, `#ffffff`

### `mermaid-to-png.scale`
- Type: `number`
- Default: `2`
- Range: `1` to `8`
- Description: Passed to `mmdc --scale`.
- Effect:
  - Larger scale => sharper PNG (especially on HiDPI screens)
  - Larger scale => bigger file size and slower render

## Image Clarity Tips

If exported PNG looks blurry:
- Set `mermaid-to-png.scale` to `2` or `3` for most cases
- Use `4` for print or zoom-heavy usage
- Keep `background = transparent` if you need compositing onto other backgrounds

A practical baseline:
- UI docs/screenshots: `scale=2`
- Presentation slides: `scale=3`
- Print assets: `scale=4`

## Output Naming Rules

### Export file mode
- `diagram.mmd` -> `diagram.png`

### Export selection mode
- If source doc is file-backed: use source file base name
- If target name already exists: append suffix `_1`, `_2`, ...
- For untitled/virtual docs: fallback to `diagram.png` in home directory (or configured output dir)

## Commands

- `mermaid-to-png.exportFile`
  - Title: **Mermaid: Export as PNG**
  - Context: `.mmd` file in explorer/editor context

- `mermaid-to-png.exportSelection`
  - Title: **Mermaid: Export as PNG**
  - Context: any editor with non-empty selection

## Troubleshooting

### "Cannot find mmdc executable"
- Install Mermaid CLI globally:

```bash
npm install -g @mermaid-js/mermaid-cli
```

- Or set correct `mermaid-to-png.mmdcPath`

### Export fails with Mermaid syntax errors
- Validate Mermaid source syntax first
- Try rendering the same file via CLI to inspect full error:

```bash
mmdc -i input.mmd -o output.png
```

### PNG not generated where expected
- Check `mermaid-to-png.outputDir`
- If relative path is used, it resolves from source file directory

## Development

### Install dependencies

```bash
pnpm install
```

### Compile

```bash
pnpm run compile
```

### Run extension in development
- Open this project in VS Code
- Press `F5` to launch Extension Development Host

### Package

```bash
pnpm run package
```

## License

MIT
