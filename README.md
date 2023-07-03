# VizGPT: Make contextual data visualization with Chat Interface

https://github.com/ObservedObserver/viz-gpt/assets/22167673/a09032d3-f3c8-4cdf-ac14-89df8754fd9f


Use GPT to generate visualization from datasets with natural language. You can edit the visualization in the context step by step to make it more precise without retyping the complex query. VizGPT turns your text queries and chat into data visualization or charts.

You can try it at [Playground](https://vizgpt.ai/)
or vizGPT on Kanaries [kanaries-vizgpt](https://kanaries.net/home/products)

#### Why VizGPT

There exist lots of great visualization products in the world, such as Tableau, pygwalker. The traditional drag-and-drop visualization tool is hard to use for people unfamiliar with configs and viz/data transformations. For example, making a tableau heatmap requires bin transformations to both axes and then dragging the measure to color. It is hard for people unfamiliar with data visualization to make a heatmap.

Some text2viz tools accept natural language to generate the visualization. However, they are not flexible enough to allow users to edit the visualization. For example, if the user wants to change the color of the heatmap, they have to retype the whole sentence.

With VizGPT, you can build visualizations step by step with a chat interface. You can edit/adjust visualizations in the context. It allows you to explore the data first without figuring out how to build complex visualization initially, especially when unfamiliar with the data.

Besides, VizGPT focus on text based visual exploration. It allows users to discover new insights from visualization and ask new questions based on the insights they just find.

## Features & Roadmap
+ [x] Natural language to data visualization [vega-lite](https://github.com/vega/vega-lite)
+ [x] Use chat context to edit your visualization. Allow users to change the chart if it is not what they expected
+ [x] Explore the data step by step by chatting with visualizations.
+ [x] Upload your own dataset (CSV) to make visulizations.
+ [ ] Save the visualizations and chat history.
+ [ ] Allow user to use visualization editor (like [graphic-walker](https://github.com/Kanaries/graphic-walker) or [vega-editor](https://github.com/vega/editor)) to edit the visualization and show the edit to GPT to make better visualization as the user prefers.

> vizGPT is now good at drawing data visualizations, not data transformations/preparation/computation. You can use other tools like Kanaries/RATH to prepare the data first and then use vizGPT to draw the visualization.

## Chat to Viz Example
<img src="https://github.com/ObservedObserver/viz-gpt/assets/22167673/3788bb64-9441-4c1a-b709-307f9bc47e3d" width="68%" alt="vizapt-1" />

<img src="https://github.com/ObservedObserver/viz-gpt/assets/22167673/50fc05a3-7511-489d-bb6f-5e0b7568e9cf" width="68%" alt="vizapt-2" />

<img src="https://github.com/ObservedObserver/viz-gpt/assets/22167673/5506e5f5-f209-4721-a2ee-61e59180f08f" width="68%" alt="vizapt-3" />

![Xnapper-2023-05-10-00 28 07](https://github.com/ObservedObserver/viz-gpt/assets/22167673/9ffb763a-d18d-4867-a974-5ab02131ce1f)

![Xnapper-2023-05-10-01 05 15](https://github.com/ObservedObserver/viz-gpt/assets/22167673/cd2d45c9-f0d4-431c-8ced-5c1228ad24a7)



### Add custom CSV file

Click `upload CSV button to add your own data. You can view or edit your data's metas at data view. The metas are inferred automatically by default. You can edit it anytime you want to make the visualization more precise.

![data view](https://github.com/ObservedObserver/viz-gpt/assets/22167673/a490e364-bcd1-418f-80eb-62e47faf4330)



## Local Development

#### step 1
Create a `.env` file at the root of the project with the following contents:

```
BASE_URL=<Azure OpenAI BaseURL>
DEPLOYMENT_NAME=<Deployment Name>
AZURE_OPENAI_KEY=<Your key>
```

#### step 2

Install dependencies:

```bash
yarn install
```

#### step 3

Then run `vercel dev` or `npm run dev` to start the server at port 3000.
