// require('dotenv').config(); 
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { v4 as uuidv4 } from 'uuid';
import {dotenv} from 'dotenv';
 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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



// console.log(process.env)
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

    // Add event listener for form submission
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

// async function updateInteractionCount(userId) {
//     try {
//         const response = await fetch('/interactions', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ userId: userId })
//         });

//         if (!response.ok) {
//             throw new Error('Failed to update interaction count');
//         }
//     } catch (error) {
//         console.error('Error updating interaction count:', error);
//     }
// }





const sbApikey = import.meta.env.VITE_SUPAB_API_KEY;
const sbUrl = import.meta.env.VITE_SUPAB_URL; 
const openAIApiKey = import.meta.env.VITE_OPEN_AI_API_KEY;


 const client = createClient(sbUrl, sbApikey);
 const llm = new ChatOpenAI({ openAIApiKey });

const standaloneQuestionTemplate = 'Given a question, convert it in a standalonequestion. question: {question} standalone question:';
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

const answerQuestionTemplate = `You are Elder Bot, a helpful and enthusiastic missionary bot dedicated to answering questions about the Book of Mormon. Your responses are based solely on the provided context of the Book of Mormon. If you're unable to find a direct answer, kindly direct the questioner to further explore the teachings of the Book of Mormon at https://www.churchofjesuschrist.org/comeuntochrist/ps/book-of-mormon-lesson. Always cite appropriate verses and chapters when providing answers.

Please note that your responses are limited to questions related to the Book of Mormon. If the question is outside of this context, kindly inform the user that it is beyond your scope of knowledge.

Context: {context}
Question: {question}
Answer:
`;
const answerPrompt = PromptTemplate.fromTemplate(answerQuestionTemplate);

const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser());

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

// Define scrollToBottom function outside progressConversation
function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

async function progressConversation() {
    const userInput = document.getElementById('user-input');
    const chatbotConversation = document.getElementById('chatbot-conversation-container');
    const typingIndicatorContainer = document.getElementById('typing-indicator-container');

    // const isChatEmpty = chatbotConversation.children.length === 0;

    // if (isChatEmpty) {
    //     const introMessage = "Hi, my name is Elder Bot and I am here to help you with your questions about the Book of Mormon. Feel free to ask me anything!";
    //     const introSpeechBubble = document.createElement('div');
    //     introSpeechBubble.classList.add('speech', 'speech-ai');
    //     introSpeechBubble.textContent = introMessage;
    //     chatbotConversation.appendChild(introSpeechBubble);

        
    //     scrollToBottom(chatbotConversation);
    // }

    // await new Promise(resolve => setTimeout(resolve, 1000));

    const question = userInput.value;
    userInput.value = '';



    // add human message
    const newHumanSpeechBubble = document.createElement('div');
    newHumanSpeechBubble.classList.add('speech', 'speech-human');
    chatbotConversation.appendChild(newHumanSpeechBubble);
    newHumanSpeechBubble.textContent = question;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    let interactionCount = parseInt(getCookie('interactionCount')) || 0; // Initialize interaction count from cookie

    if (interactionCount >= 5) {
        displayLimitReachedMessage();
        return; 
    }

    // Increment interaction count
    interactionCount++;
    setCookie('interactionCount', interactionCount, 1);

    // Invoke AI to get response
    const response = await chain.invoke({
        question: question
    });

    // add AI message
    const newAiSpeechBubble = document.createElement('div');
    newAiSpeechBubble.classList.add('speech', 'speech-ai');
    chatbotConversation.appendChild(newAiSpeechBubble);
    newAiSpeechBubble.textContent = response;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

    // Scroll to bottom after adding new message
   

    // Update local storage
    localStorage.setItem('conversation', chatbotConversation.innerHTML);
}

function displayLimitReachedMessage() {
    const chatbotConversation = document.getElementById('chatbot-conversation-container');
    const limitMessage = document.createElement('div');
    limitMessage.textContent = "You have reached the maximum number of interactions for today. Please contact thechurchofjesuschrist.org for a better conversion";
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
        question: ({ original_input }) => original_input.question
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