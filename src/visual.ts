import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

interface RadialNode {
    label: string;
    percentage: string;
    x: number;
    y: number;
    fill: string;
    stroke: string;
    radius: number;
}

export class Visual implements IVisual {
    private target: HTMLElement;
    private svg: SVGSVGElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.target.classList.add("optimizer-visual");
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("viewBox", "0 0 1200 900");
        this.target.appendChild(this.svg);
    }

    public update(options: VisualUpdateOptions): void {
        const dataView: DataView | undefined = options.dataViews && options.dataViews[0];

        let nodes = this.getDefaultNodes();

        if (dataView && dataView.categorical) {
            const categories = dataView.categorical.categories && dataView.categorical.categories[0];
            const values = dataView.categorical.values && dataView.categorical.values[0];

            if (categories && values && categories.values.length > 0) {
                const generated: RadialNode[] = [];
                const total = values.values.reduce((sum, value) => sum + Number(value || 0), 0) || 1;

                for (let i = 0; i < categories.values.length; i++) {
                    const label = String(categories.values[i]);
                    const value = Number(values.values[i] || 0);
                    const angle = (Math.PI * 2 * i) / categories.values.length - Math.PI / 2;
                    const distance = 220 + (i % 3) * 28;
                    const x = 600 + Math.cos(angle) * distance;
                    const y = 430 + Math.sin(angle) * distance;
                    const percentage = total > 0 ? `${Math.round((value / total) * 100)}%` : "0%";
                    const palette = [
                        "#f0bfd8", "#d9d6f0", "#b8d8e8", "#f8d6ad", "#b5d9c9", "#d9e5b6",
                        "#edc3bd", "#d0ddf2", "#d2edcb", "#f3cbbd", "#f2d1a3", "#c0d9d8"
                    ];

                    generated.push({
                        label,
                        percentage,
                        x,
                        y,
                        fill: palette[i % palette.length],
                        stroke: palette[i % palette.length],
                        radius: 36
                    });
                }

                if (generated.length > 0) {
                    nodes = generated;
                }
            }
        }

        this.render(nodes);
    }

    private render(nodes: RadialNode[]): void {
        this.svg.innerHTML = "";

        const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg.setAttribute("x", "0");
        bg.setAttribute("y", "0");
        bg.setAttribute("width", "1200");
        bg.setAttribute("height", "900");
        bg.setAttribute("fill", "#e4e0dd");
        this.svg.appendChild(bg);

        const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("x", "50");
        title.setAttribute("y", "58");
        title.setAttribute("fill", "#2f2f2f");
        title.setAttribute("font-size", "32");
        title.setAttribute("font-weight", "700");
        title.textContent = "Product Breakdown";
        this.svg.appendChild(title);

        const centerX = 600;
        const centerY = 455;

        nodes.forEach((node) => {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", centerX.toString());
            line.setAttribute("y1", centerY.toString());
            line.setAttribute("x2", node.x.toString());
            line.setAttribute("y2", node.y.toString());
            line.setAttribute("stroke", node.stroke);
            line.setAttribute("stroke-width", "2.2");
            line.setAttribute("stroke-linecap", "round");
            line.setAttribute("opacity", "0.9");
            this.svg.appendChild(line);
        });

        const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        centerCircle.setAttribute("cx", centerX.toString());
        centerCircle.setAttribute("cy", centerY.toString());
        centerCircle.setAttribute("r", "138");
        centerCircle.setAttribute("fill", "#0f2e4a");
        centerCircle.setAttribute("opacity", "1");
        this.svg.appendChild(centerCircle);

        const centerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        centerText.setAttribute("x", centerX.toString());
        centerText.setAttribute("y", (centerY - 18).toString());
        centerText.setAttribute("text-anchor", "middle");
        centerText.setAttribute("fill", "#f3f7fb");
        centerText.setAttribute("font-size", "22");
        centerText.setAttribute("font-weight", "600");
        centerText.textContent = "Optimizer";
        this.svg.appendChild(centerText);

        const centerNumber = document.createElementNS("http://www.w3.org/2000/svg", "text");
        centerNumber.setAttribute("x", centerX.toString());
        centerNumber.setAttribute("y", (centerY + 28).toString());
        centerNumber.setAttribute("text-anchor", "middle");
        centerNumber.setAttribute("fill", "#f3f7fb");
        centerNumber.setAttribute("font-size", "56");
        centerNumber.setAttribute("font-weight", "700");
        centerNumber.textContent = "156";
        this.svg.appendChild(centerNumber);

        const centerSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
        centerSub.setAttribute("x", centerX.toString());
        centerSub.setAttribute("y", (centerY + 68).toString());
        centerSub.setAttribute("text-anchor", "middle");
        centerSub.setAttribute("fill", "#dce8f6");
        centerSub.setAttribute("font-size", "18");
        centerSub.setAttribute("font-weight", "500");
        centerSub.textContent = "Opportunities";
        this.svg.appendChild(centerSub);

        const centerRevenue = document.createElementNS("http://www.w3.org/2000/svg", "text");
        centerRevenue.setAttribute("x", centerX.toString());
        centerRevenue.setAttribute("y", (centerY + 100).toString());
        centerRevenue.setAttribute("text-anchor", "middle");
        centerRevenue.setAttribute("fill", "#cfe0f4");
        centerRevenue.setAttribute("font-size", "36");
        centerRevenue.setAttribute("font-weight", "700");
        centerRevenue.textContent = "$7.3M";
        this.svg.appendChild(centerRevenue);

        const centerRevenueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        centerRevenueLabel.setAttribute("x", centerX.toString());
        centerRevenueLabel.setAttribute("y", (centerY + 128).toString());
        centerRevenueLabel.setAttribute("text-anchor", "middle");
        centerRevenueLabel.setAttribute("fill", "#dfeaf8");
        centerRevenueLabel.setAttribute("font-size", "14");
        centerRevenueLabel.setAttribute("font-weight", "500");
        centerRevenueLabel.textContent = "Total Opp Revenue";
        this.svg.appendChild(centerRevenueLabel);

        nodes.forEach((node) => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", node.x.toString());
            circle.setAttribute("cy", node.y.toString());
            circle.setAttribute("r", node.radius.toString());
            circle.setAttribute("fill", node.fill);
            circle.setAttribute("stroke", "rgba(255,255,255,0.7)");
            circle.setAttribute("stroke-width", "1");
            group.appendChild(circle);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", node.x.toString());
            text.setAttribute("y", (node.y - 10).toString());
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#2d3847");
            text.setAttribute("font-size", "11");
            text.setAttribute("font-weight", "600");

            const labelParts = this.wrapLabel(node.label);
            labelParts.forEach((part, index) => {
                const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan.setAttribute("x", node.x.toString());
                tspan.setAttribute("dy", index === 0 ? "0" : "13");
                tspan.textContent = part;
                text.appendChild(tspan);
            });

            group.appendChild(text);

            const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valueText.setAttribute("x", node.x.toString());
            valueText.setAttribute("y", (node.y + 18).toString());
            valueText.setAttribute("text-anchor", "middle");
            valueText.setAttribute("fill", "#2d3847");
            valueText.setAttribute("font-size", "12");
            valueText.setAttribute("font-weight", "700");
            valueText.textContent = node.percentage;
            group.appendChild(valueText);

            this.svg.appendChild(group);
        });
    }

    private wrapLabel(label: string): string[] {
        if (label.length <= 10) {
            return [label];
        }

        const midpoint = Math.ceil(label.length / 2);
        return [label.slice(0, midpoint).trim(), label.slice(midpoint).trim()].filter(Boolean);
    }

    private getDefaultNodes(): RadialNode[] {
        return [
            { label: "Data Loads", percentage: "15%", x: 640, y: 140, fill: "#f2bfd2", stroke: "#e5a8c7", radius: 26 },
            { label: "Payroll", percentage: "1%", x: 560, y: 230, fill: "#d9d7ee", stroke: "#d4c8e3", radius: 22 },
            { label: "Expense", percentage: "15%", x: 850, y: 210, fill: "#d7e8bc", stroke: "#c5d7a9", radius: 26 },
            { label: "APIs", percentage: "16%", x: 510, y: 330, fill: "#bfd8ed", stroke: "#a8c9e8", radius: 28 },
            { label: "LMS", percentage: "44%", x: 680, y: 315, fill: "#b5d9ec", stroke: "#98c7e5", radius: 30 },
            { label: "File Integr", percentage: "40%", x: 860, y: 340, fill: "#cbeec0", stroke: "#a9da9a", radius: 28 },
            { label: "Recruiting", percentage: "88%", x: 545, y: 420, fill: "#a8dfe6", stroke: "#88c8d1", radius: 38 },
            { label: "Advanced HR", percentage: "78%", x: 760, y: 400, fill: "#cfecc8", stroke: "#afd7a0", radius: 32 },
            { label: "Rewards", percentage: "36%", x: 915, y: 420, fill: "#f2c3b9", stroke: "#ebaf9d", radius: 26 },
            { label: "Elevate Sou", percentage: "13%", x: 1030, y: 370, fill: "#f4d2a5", stroke: "#f0bf80", radius: 24 },
            { label: "ESS", percentage: "77%", x: 930, y: 520, fill: "#d3f0d0", stroke: "#afdca7", radius: 32 },
            { label: "EDI", percentage: "35%", x: 1030, y: 565, fill: "#f1d8c2", stroke: "#e3b591", radius: 24 },
            { label: "Benefits", percentage: "32%", x: 900, y: 655, fill: "#f2d0a1", stroke: "#edb66e", radius: 24 },
            { label: "Payroll Pr", percentage: "75%", x: 740, y: 700, fill: "#f2d29a", stroke: "#eac27a", radius: 29 },
            { label: "Compensat", percentage: "32%", x: 980, y: 690, fill: "#f7d8c7", stroke: "#f4c09b", radius: 22 },
            { label: "General L", percentage: "69%", x: 640, y: 700, fill: "#dbe7f6", stroke: "#c5d7ef", radius: 28 },
            { label: "Community", percentage: "29%", x: 540, y: 635, fill: "#e7d9f0", stroke: "#d7c1e6", radius: 25 },
            { label: "Health", percentage: "10%", x: 1080, y: 700, fill: "#f3d8ac", stroke: "#ebc778", radius: 22 },
            { label: "Employee V", percentage: "26%", x: 470, y: 575, fill: "#dfe9d9", stroke: "#bfd0b1", radius: 25 },
            { label: "Scheduling", percentage: "25%", x: 420, y: 675, fill: "#d9efef", stroke: "#bae3e0", radius: 24 },
            { label: "API Integr", percentage: "6%", x: 420, y: 810, fill: "#d0ddf0", stroke: "#b0c3dd", radius: 22 },
            { label: "Sounding A", percentage: "6%", x: 580, y: 810, fill: "#dbe7ef", stroke: "#bfd8e8", radius: 22 },
            { label: "Time Clocks", percentage: "4%", x: 300, y: 520, fill: "#f3d8c0", stroke: "#e7bda0", radius: 24 },
            { label: "Check Ser", percentage: "23%", x: 250, y: 600, fill: "#f3d7d4", stroke: "#efb9b9", radius: 22 },
            { label: "Setup", percentage: "68%", x: 350, y: 700, fill: "#dfeef6", stroke: "#cae0ec", radius: 26 },
            { label: "Recruitm", percentage: "23%", x: 310, y: 760, fill: "#d2ebeb", stroke: "#b4d9d2", radius: 24 },
            { label: "Asset Mana", percentage: "1%", x: 415, y: 270, fill: "#e3d5ee", stroke: "#d0b9dd", radius: 18 },
            { label: "Community", percentage: "19%", x: 470, y: 390, fill: "#e7cff0", stroke: "#d6b0e6", radius: 22 },
            { label: "Native Int", percentage: "21%", x: 395, y: 515, fill: "#f2d2ce", stroke: "#eaab9d", radius: 24 },
            { label: "Compliance", percentage: "66%", x: 510, y: 510, fill: "#e7d7b9", stroke: "#d9c186", radius: 28 },
            { label: "Service", percentage: "65%", x: 540, y: 350, fill: "#d9ebf2", stroke: "#bad5e5", radius: 26 },
            { label: "Onboarding", percentage: "76%", x: 760, y: 540, fill: "#e1d6f2", stroke: "#c5b2e2", radius: 28 },
            { label: "Performance", percentage: "58%", x: 545, y: 440, fill: "#f1d3bf", stroke: "#ebae8b", radius: 30 },
            { label: "Internal B", percentage: "1%", x: 610, y: 260, fill: "#d0e4d0", stroke: "#b5d3b3", radius: 18 }
        ];
    }
}
