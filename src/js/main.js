import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";

 const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
   projectId: import.meta.env.VITE_PROJECT_ID,
   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
   appId: import.meta.env.VITE_APP_ID,
   measurementId: import.meta.env.VITE_MEASURE_ID
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);




document.addEventListener('DOMContentLoaded', () => {
    const savedConversation = localStorage.getItem('conversation');
    const chatbotConversation = document.getElementById('chatbot-conversation-container');
    let interactionCount = parseInt(getCookie('interactionCount')) || 0;

    // Function to generate UUID
    function generateUserId() {
        return 'user-' + uuidv4();
    }

    // Function to scroll to the bottom of the chat
    function scrollToBottom(container) {
        container.scrollTop = container.scrollHeight;
    }

    // Function to check if chatbot conversation is empty
    function isChatbotConversationEmpty() {
        return chatbotConversation.children.length === 0;
    }

    // Function to display the introductory message
    function displayIntroMessage() {
        const introMessage = "Hi, my name is Elder Bot and I am here to help you with your questions about the Book of Mormon. Feel free to ask me anything!";
        const introSpeechBubble = document.createElement('div');
        introSpeechBubble.classList.add('speech', 'speech-ai');
        introSpeechBubble.textContent = introMessage;
        chatbotConversation.appendChild(introSpeechBubble);
        scrollToBottom(chatbotConversation);
    }

    // Display intro message only if the chat is empty
    if (isChatbotConversationEmpty() && !savedConversation) {
        displayIntroMessage();
    }

    
    document.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (interactionCount < 5) {
            await progressConversation(); 
            interactionCount++; 
            setCookie('interactionCount', interactionCount, 1);
            
            const userId = generateUserId(); 
            // await updateInteractionCount(userId);
        } else {
            displayLimitReachedMessage();
        }
    });

    // Restore saved conversation from local storage if available
    if (savedConversation) {
        chatbotConversation.innerHTML = savedConversation;
        scrollToBottom(chatbotConversation);
    }
});






const sbApikey = import.meta.env.VITE_SUPAB_API_KEY;
const sbUrl = import.meta.env.VITE_SUPAB_URL; 
const openAIApiKey = import.meta.env.VITE_OPEN_AI_API_KEY;



 const client = createClient(sbUrl, sbApikey);
 const llm = new ChatOpenAI({ openAIApiKey });

 const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
 conversation history: {conv_history}
 question: {question} 
 standalone question:`
 
 const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

const answerQuestionTemplate = `You are Elder Bot, a helpful and enthusiastic missionary bot dedicated
 to answering questions about the Book of Mormon. Your responses are based 
 solely on the provided context of the Book of Mormon. If you're unable to find a 
 direct answer, kindly direct the questioner to further explore the teachings of the Book of Mormon at 
 https://www.churchofjesuschrist.org/comeuntochrist/ps/book-of-mormon-lesson. Always cite appropriate verses and 
 chapters when providing answers.

Please note that your responses are limited to questions related to the Book of Mormon. If the question is outside of this context, kindly inform the user that it is beyond your scope of knowledge.

Context: {context}
Question: {question}
conversation history: {conv_history}
Answer:
`;
const answerPrompt = PromptTemplate.fromTemplate(answerQuestionTemplate);

const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser());

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());


function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(parentElement, show) {
    let typingIndicator = parentElement.querySelector('.typing-indicator');
    if (!typingIndicator && show) {
       
        typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            typingIndicator.appendChild(dot);
        }
        parentElement.appendChild(typingIndicator);
    } else if (typingIndicator && !show) {
     
        typingIndicator.remove();
    }
}




function formatConvHistory(messages) {
    return messages.map((message, i) => {
        if (i % 2 === 0){
            return `Human: ${message}`
        } else {
            return `AI: ${message}`
        }
    }).join('\n')
}


const conversationHistory = []

async function progressConversation() {
    const userInput = document.getElementById('user-input');
    const chatbotConversation = document.getElementById('chatbot-conversation-container');
    const question = userInput.value.trim();
    userInput.value = '';  

    if (question === '') {
        return;  
    }

    // Add human message to the conversation.
    const newHumanSpeechBubble = document.createElement('div');
    newHumanSpeechBubble.classList.add('speech', 'speech-human');
    newHumanSpeechBubble.textContent = question;
    chatbotConversation.appendChild(newHumanSpeechBubble);
    
    let interactionCount = parseInt(getCookie('interactionCount')) || 0;
    if (interactionCount >= 5) {
        displayLimitReachedMessage();
        return;  
    }

    interactionCount++;
    setCookie('interactionCount', interactionCount, 1);

 
    showTypingIndicator(chatbotConversation, true);
    scrollToBottom(chatbotConversation); 

    
    const response = await chain.invoke({
        question: question,
        conv_history: formatConvHistory(conversationHistory)
    });

    // Hide typing indicator now that response is ready.
    showTypingIndicator(chatbotConversation, false);

    // Add the AI's response to the conversation and ensure it's visible.
    const newAiSpeechBubble = document.createElement('div');
    newAiSpeechBubble.classList.add('speech', 'speech-ai');
    newAiSpeechBubble.textContent = response;
    chatbotConversation.appendChild(newAiSpeechBubble);
    scrollToBottom(chatbotConversation); 

    // Update conversation history and local storage.
    conversationHistory.push(question, response);
    localStorage.setItem('conversation', chatbotConversation.innerHTML);
}




function displayLimitReachedMessage() {
    const chatbotConversation = document.getElementById('chatbot-conversation-container');
    const limitMessage = document.createElement('div');
    limitMessage.textContent = "You have reached the maximum number of interactions for today. Please contact churchofjesuschrist.org for a better conversion";
    limitMessage.classList.add('speech', 'speech-ai');
    chatbotConversation.appendChild(limitMessage);
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

  

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const vectorStore = new MemoryVectorStore(embeddings, {
    client,
    tableName: 'documents', 
    queryName: 'match_documents'
});

const retriever = vectorStore.asRetriever();

function combineDocuments(docs){
    return docs.map((doc)=>doc.pageContent).join('\n\n');
}

const retrieverChain = RunnableSequence.from([
    prevResult => prevResult.standalone_question,
    retriever,
    combineDocuments
]);

const chain = RunnableSequence.from([
    {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
    },
    {
        context: retrieverChain,
        question: ({ original_input }) => original_input.question,
        conv_history: ({ original_input }) => original_input.conv_history
    },
    answerChain
]);


//TODO: Tokens per user feature
// better use (colors, logo, etc)
// prevent from responding questions of unrelated content
// server side for API keys
// loader for when context loading
// remember conversation. 
//Local storage for questions asked. 
//Remove questions already asked (clear cache). 
//Have the chat to ask the user to hire me when it doesn't know a question or when running out of tokens. 