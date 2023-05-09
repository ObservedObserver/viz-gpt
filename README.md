# VizGPT: Build visualization with Chat Interface

![VizGPT](https://github.com/ObservedObserver/viz-gpt/assets/22167673/c4201960-83c9-484a-a5ea-15f6a85d5837)



Use GPT to generate visualization from dataset with natural language. There exist lots of great visualization product in the world, such as tableau, pygwalker. Traditional drag-and-drop visualization tool is hard to use for people who are not familiar with configs and viz/data transformations. For example, making a heatmap in tableau requires to make bin transformations to both axis, and then drag the measure to color. It is hard for people who are not familiar with data visualization to make a heatmap.

Some text2viz tools accepts natural language to generate visualization. However, they are not flexible enough to allow user to edit the visualization. For example, if the user want to change the color of the heatmap, they have to retype the whole sentence.

With VizGPT, you can build visualizations step by step with chat interface. You can edit/adjust visualizations in the context. It allows your to explore the data first without figuring out how to build complex visualization at begining, especially when you are not familiar with the data.


## Features
+ [x] Natural language to data visualization
+ [x] Use chat context to edit your visualization. Allow user to change the chart if it is not they expected
+ [x] Explore the data step by step by chatting with visualizations.
+ [x] Upload your own dataset (CSV) to make visulization.
+ [] Save the visualizations and chat history.
+ [ ] Allow user to use visulization editor (like [graphic-walker](https://github.com/Kanaries/graphic-walker) or [vega-editor](https://github.com/vega/editor)) to edit the visualization and show the edit to GPT to make better visualization as the user prefers.

## Chat to Viz Example

![vizgpt-1](https://github.com/ObservedObserver/viz-gpt/assets/22167673/3788bb64-9441-4c1a-b709-307f9bc47e3d)

![vizgpt-2](https://github.com/ObservedObserver/viz-gpt/assets/22167673/50fc05a3-7511-489d-bb6f-5e0b7568e9cf)

![vizgpt-3](https://github.com/ObservedObserver/viz-gpt/assets/22167673/5506e5f5-f209-4721-a2ee-61e59180f08f)

### Add custom CSV file

Click `upload csv` button to add your own data. You can view or edit your data's metas at data view. The metas is infered automatically by default, you can edit it anytime you want to make the visualization more precise.

![Xnapper-2023-05-10-00 28 51](https://github.com/ObservedObserver/viz-gpt/assets/22167673/a490e364-bcd1-418f-80eb-62e47faf4330)



## Local Development

Create a `.env` file at the root of the project with the following contents:

```
BASE_URL=<Azure OpenAI BaseURL>
DEPLOYMENT_NAME=<Deployment Name>
AZURE_OPENAI_KEY=<Your key>
```

Then run `vercel dev` or `npm run dev` to start the server at port 3000.
