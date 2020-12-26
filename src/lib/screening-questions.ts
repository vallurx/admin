export const screeningQuestions = [
    'In the past two weeks, have you tested positive for COVID 19 or are you currently being monitored for Covid19?',
    'In the past two weeks, have you had contact with anyone who tested positive for COVID 19?',
    'Do you currently or have you in the past 14 days, had a fever, chills, cough, shortness of breath, difficulty breathing, fatigue, muscle or body aches, headache, new loss of taste or smell, sore throat, nausea, vomiting or diarrhea?',
    'Are you sick today? (For example: a cold, fever, or acute illness)',
    'Do you have allergies or reactions to any foods, medications, vaccines or latex? (For example: eggs, gelatin, neomycin, thimerosal, etc.)',
    'Have you had a seizure or a brain or other nervous system problem or Guillain Barre?',
    'Do you take anticoagulation medication? For example: warfarin, Coumadin or other blood thinner',
    'Do you have a long-term health problem such as heart disease, lung disease, liver disease, asthma or any other immune system problem?',
    'Do you have a weakened immune system or in past 3 months, take medications that weaken it such as cortisone, prednisone, other steroids, anticancer drugs, or radiation treatments?',
    'Has the person receiving shots received a transfusion of blood or blood products, been given a medicine called immune (gamma) globulin in the past year, taken an anti-viral drug, received monoclonal antibodies or convalescent plasma as part of COVID-19 treatment?',
    'For women: are you pregnant or is there a chance you could become pregnant during the next month?',
    'Have your received any vaccinations or TB skin test in the past 4 weeks?',
];

export const getAnswerToQuestion = (answer: boolean | null): string => {
    if (answer === null) {
        return 'N/A';
    }

    return answer ? 'Yes' : 'No';
};