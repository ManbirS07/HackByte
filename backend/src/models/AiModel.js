const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const fs = require("node:fs");
  const mime = require("mime-types");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
  };
  
 
  export const response = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "chech whether the following resume is qualified for the role of volunteer for the cause of healthcare Dr. Ananya Mehta\n LinkedIn: linkedin.com/in/ananyamehta\n Education\n Email: ananya.mehta@gmail.com\n Mobile: +91-XXXXXXXXXX\n • All India Institute of Medical Sciences (AIIMS)\n Doctor of Medicine (MBBS); CGPA: 8.5/10\n Skills Summary\n New Delhi, India\n July 2015– May 2020\n • Medical Skills: Clinical Diagnosis, Patient Counseling, Emergency Medicine, Pharmacology\n • Technical Tools: SPSS, R (Epidemiology), Microsoft Office, EHR systems (e.g., Cerner)\n • Research Skills: Medical Writing, Clinical Trials, Literature Review, Data Analysis\n • Soft Skills: Teamwork, Communication, Empathy, Time Management, Leadership\n Experience\n • Safdarjung Hospital\n Intern Doctor– Various Departments\n New Delhi, India\n May 2020– May 2021– Rotations: Handled OPD/IPD in departments including Surgery, Pediatrics, Psychiatry, and Gynecology.– Emergency Care: Assisted in trauma cases, suturing, CPR, and basic life support procedures.– Patient Education: Counseled patients regarding preventive healthcare and post-operative care.\n • World Health Organization (WHO)– SEARO\n Public Health Intern\n Remote\n Jun 2021– Sep 2021– Project: Assisted in evaluating maternal health indicators across South-East Asian countries.– Reporting: Compiled weekly reports and contributed to policy suggestion briefs.\n Projects\n • AStudy on Prevalence of Anemia in Adolescent Girls (Community Health Project): Surveyed over 500 girls and\n analyzed nutritional patterns; Proposed intervention strategies in collaboration with local health authorities.\n • COVID-19 Risk Perception among Healthcare Workers: Conducted hospital-wide surveys and created educational\n infographics to promote vaccination.\n Publications\n • Research Paper: ”Effect of Daily Iron Supplementation in Adolescent Girls: A Randomized Controlled Trial”– Indian\n Journal of Pediatrics, 2021.\n • Conference Abstract: ”Assessing the Psychological Impact of COVID-19 on Frontline Workers”– Presented at IAPSM\n 2022.\n Honors and Awards\n • Awarded Best Intern– Safdarjung Hospital (2021)\n • Winner– National Public Health Quiz (2019)\n Volunteer Experience\n • Volunteer Doctor– Pulse Polio Immunization Program (Govt. of India)\n Immunized over 300 children in underserved areas during National Pulse Polio Days.\n • Health Awareness Campaign Lead– NGO Aarogya\n Conducted menstrual hygiene workshops for school girls in rural regions.\n Delhi, India\n 2018– 2020\n Delhi, India\n 2019– 202"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Yes, based on the resume provided, **Dr. Ananya Mehta is highly qualified for a volunteer role in healthcare.** Here's a breakdown of why:\n\n*   **Education:** Holds an MBBS degree from a prestigious institution (AIIMS)\n*   **Experience:** Worked as an intern doctor at Safdarjung Hospital, involved in patient education\n*   **Projects:** Experience in maternal health and COVID-19 vaccination\n*   **Publications:** Published research in the Indian Journal of Pediatrics.\n*   **Volunteer Experience:** already engaged in a similar cause\n*   **Skills:** Communication, compassion, and leadership\n\n"},
          ],
        },
      ],
});
  
//     const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//     // TODO: Following code needs to be updated for client-side apps.
//     const candidates = result.response.candidates;
//     for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
//       for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
//         const part = candidates[candidate_index].content.parts[part_index];
//         if(part.inlineData) {
//           try {
//             const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
//             fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
//             console.log(`Output written to: ${filename}`);
//           } catch (err) {
//             console.error(err);
//           }
//         }
//       }
//     }
//     console.log(result.response.text());
//   });
  
