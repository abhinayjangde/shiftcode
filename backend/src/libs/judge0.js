import axios from "axios"

export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "JAVASCRIPT":63,
        "JAVA":62,
        "PYTHON":71,
    }

    return languageMap[language.toUpperCase()]
}

const sleep  = (ms)=> new Promise((resolve)=> setTimeout(resolve , ms))

export const pollBatchResults = async (tokens)=>{
    while(true){
        
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;

        const isAllDone = results.every(
            (r)=> r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDone) return results
        await sleep(1000)
    }
}

export const submitBatch = async (submissions)=>{
    try {
        const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
            submissions
        })
    
        console.log("Submission Results: ", data)
    
        return data // [{token} , {token} , {token}]
    } catch (error) {
        console.error("Error submitting batch: ", error)
        console.error("Judge0 API Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Judge0 API error: ${error.message}. Check if Judge0 service is running properly.`);
    }
}

export function getLanguageName(langaugeId){

    const LANGAUGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java"
    }

    return LANGAUGE_NAMES[langaugeId] || "Unknown"
}