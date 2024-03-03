import{B as m,C as f,a as c,c as n,r as o,P as h}from"./main-D6hUryeJ.js";class x extends m{constructor(e){super(e)}async format(e){return(await this.formatPromptValue(e)).toString()}async formatPromptValue(e){const t=await this.formatMessages(e);return new f(t)}}class p extends c{constructor(e){if(super(e),Object.defineProperty(this,"lc_serializable",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"examples",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"exampleSelector",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"examplePrompt",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"suffix",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"exampleSeparator",{enumerable:!0,configurable:!0,writable:!0,value:`

`}),Object.defineProperty(this,"prefix",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"templateFormat",{enumerable:!0,configurable:!0,writable:!0,value:"f-string"}),Object.defineProperty(this,"validateTemplate",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.assign(this,e),this.examples!==void 0&&this.exampleSelector!==void 0)throw new Error("Only one of 'examples' and 'example_selector' should be provided");if(this.examples===void 0&&this.exampleSelector===void 0)throw new Error("One of 'examples' and 'example_selector' should be provided");if(this.validateTemplate){let t=this.inputVariables;this.partialVariables&&(t=t.concat(Object.keys(this.partialVariables))),n(this.prefix+this.suffix,this.templateFormat,t)}}_getPromptType(){return"few_shot"}static lc_name(){return"FewShotPromptTemplate"}async getExamples(e){if(this.examples!==void 0)return this.examples;if(this.exampleSelector!==void 0)return this.exampleSelector.selectExamples(e);throw new Error("One of 'examples' and 'example_selector' should be provided")}async partial(e){const t=this.inputVariables.filter(i=>!(i in e)),r={...this.partialVariables??{},...e},a={...this,inputVariables:t,partialVariables:r};return new p(a)}async format(e){const t=await this.mergePartialAndUserVariables(e),r=await this.getExamples(t),a=await Promise.all(r.map(s=>this.examplePrompt.format(s))),i=[this.prefix,...a,this.suffix].join(this.exampleSeparator);return o(i,this.templateFormat,t)}serialize(){if(this.exampleSelector||!this.examples)throw new Error("Serializing an example selector is not currently supported");if(this.outputParser!==void 0)throw new Error("Serializing an output parser is not currently supported");return{_type:this._getPromptType(),input_variables:this.inputVariables,example_prompt:this.examplePrompt.serialize(),example_separator:this.exampleSeparator,suffix:this.suffix,prefix:this.prefix,template_format:this.templateFormat,examples:this.examples}}static async deserialize(e){const{example_prompt:t}=e;if(!t)throw new Error("Missing example prompt");const r=await h.deserialize(t);let a;if(Array.isArray(e.examples))a=e.examples;else throw new Error("Invalid examples format. Only list or string are supported.");return new p({inputVariables:e.input_variables,examplePrompt:r,examples:a,exampleSeparator:e.example_separator,prefix:e.prefix,suffix:e.suffix,templateFormat:e.template_format})}}class u extends x{_getPromptType(){return"few_shot_chat"}static lc_name(){return"FewShotChatMessagePromptTemplate"}constructor(e){if(super(e),Object.defineProperty(this,"lc_serializable",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.defineProperty(this,"examples",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"exampleSelector",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"examplePrompt",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"suffix",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"exampleSeparator",{enumerable:!0,configurable:!0,writable:!0,value:`

`}),Object.defineProperty(this,"prefix",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"templateFormat",{enumerable:!0,configurable:!0,writable:!0,value:"f-string"}),Object.defineProperty(this,"validateTemplate",{enumerable:!0,configurable:!0,writable:!0,value:!0}),this.examples=e.examples,this.examplePrompt=e.examplePrompt,this.exampleSeparator=e.exampleSeparator??`

`,this.exampleSelector=e.exampleSelector,this.prefix=e.prefix??"",this.suffix=e.suffix??"",this.templateFormat=e.templateFormat??"f-string",this.validateTemplate=e.validateTemplate??!0,this.examples!==void 0&&this.exampleSelector!==void 0)throw new Error("Only one of 'examples' and 'example_selector' should be provided");if(this.examples===void 0&&this.exampleSelector===void 0)throw new Error("One of 'examples' and 'example_selector' should be provided");if(this.validateTemplate){let t=this.inputVariables;this.partialVariables&&(t=t.concat(Object.keys(this.partialVariables))),n(this.prefix+this.suffix,this.templateFormat,t)}}async getExamples(e){if(this.examples!==void 0)return this.examples;if(this.exampleSelector!==void 0)return this.exampleSelector.selectExamples(e);throw new Error("One of 'examples' and 'example_selector' should be provided")}async formatMessages(e){const t=await this.mergePartialAndUserVariables(e);let r=await this.getExamples(t);r=r.map(i=>{const s={};return this.examplePrompt.inputVariables.forEach(l=>{s[l]=i[l]}),s});const a=[];for(const i of r){const s=await this.examplePrompt.formatMessages(i);a.push(...s)}return a}async format(e){const t=await this.mergePartialAndUserVariables(e),r=await this.getExamples(t),i=(await Promise.all(r.map(l=>this.examplePrompt.formatMessages(l)))).flat().map(l=>l.content),s=[this.prefix,...i,this.suffix].join(this.exampleSeparator);return o(s,this.templateFormat,t)}async partial(e){const t=this.inputVariables.filter(i=>!(i in e)),r={...this.partialVariables??{},...e},a={...this,inputVariables:t,partialVariables:r};return new u(a)}}export{u as FewShotChatMessagePromptTemplate,p as FewShotPromptTemplate};
