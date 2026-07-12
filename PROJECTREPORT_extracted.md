                                               A PROJECT REPORT
On
        PRIVACY ANALYZER FOR SOCIAL MEDIA ACCOUNTS: PrivAI


Submitted by
Ayan Chatterjee (10800222027)
Karishma Bhardwaj (10800222088)
Divyanshu Kumar Verma (10800222096)
Isita Roy (10800222103)
               

        Submitted to Asansol Engineering College in partial fulfilment of the

requirements for the degree of

Bachelor of Technology

(Information Technology)

Under the guidance

of

Mr. Biplab Kumar Mondal
(Assistant Professor)









Information Technology
Asansol Engineering College 
Asansol 


Affiliated to

   MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY



CERTIFICATE

Certified that this project report on “Privacy Analyzer for Social Media Accounts” is the Bonafide work of “Divyanshu Kumar Verma (10800222096), Karishma Bhardwaj (10800222088), Isita Roy (10800222103), Ayan Chatterjee (10800222027)” who carried out the project work under my supervision.






  __________________________________            _________________________________
          Mr. Biplab Kumar MondalDr. Vedatrayee Chatterjee

                 Assistant Professor                                                       Head of Department
   Department of Information Technology             Department of Information Technology



                                   


                                                   Information Technology
Asansol Engineering College 
Asansol

ACKNOWLEDGEMENT

It is our great privilege to express my profound and sincere gratitude to our Project Supervisor Mrs. Saheli Das, Assistant Professor for providing me with very cooperative and precious guidance at every stage of the present project work being carried out under his/her supervision. His valuable advice and instructions in carrying out the present study have been a very rewarding and pleasurable experience that has greatly benefitted us throughout our work.

We would also like to pay our heartiest thanks and gratitude to Dr. Vedatrayee Chatterjee, HoD, and all the faculty members of the Information Technology Department, Asansol Engineering College for various suggestions being provided in attaining success in our work.

Finally, we would like to express our deep sense of gratitude to our parents for their constant motivation and support throughout our work. 

……………………………………………
(Divyanshu Kumar Verma)

……………………………………………
(Karishma Bhardwaj)

……………………………………………
(Isita Roy)

……………………………………………
(Ayan Chatterjee)




Date: 16/07/20264th Year
Place: AsansolInformation Technology

TABLE OF CONTENTS
Certificate
Acknowledgement
Abstract / Project Synopsis
List of Tables
List of Figures
Chapter 1: Introduction
Background
Problem Statement
Motivation
Objectives
Scope of the Project
Proposed Solution Overview
Organization of the Report
Chapter 2: Literature Review
Introduction
Privacy Issues in Social Media
Personally Identifiable Information (PII)
Existing Privacy Protection Mechanisms
Browser Extensions for Security and Privacy
Large Language Models for Text Privacy Analysis
Vision-Language Models (VLMs) for Image Privacy Analysis
Review of Existing Research
Research Gap
 Summary
Chapter 3: System Design and Architecture
Introduction
System Overview
Functional Requirements
Non-Functional Requirements
Overall System Architecture
Browser Extension Architecture
Text Analysis Module
Image Analysis Module
Risk Assessment Engine
User Interface Design
Workflow of the Proposed System
Use Case Diagram
Data Flow Diagram (DFD)
Sequence Diagram
Technology Stack
Chapter 4: System Implementation and Features
Introduction
Development Environment
Software and Hardware Requirements
Browser Extension Implementation
Backend Implementation
Artificial Intelligence Model Integration
Text Privacy Detection Implementation
Image Privacy Detection Implementation
Privacy Risk Assessment Implementation
Features of the Proposed System
Summary
Chapter 5: System Testing and Evaluation
Introduction
Testing Methodology
Limitations
Chapter 6: Conclusion and Future Scope
Conclusion
Future Scope
 References
 Appendix


LIST OF TABLES

Table 1
Name of Table
Page Number
Table 2
Name of Table
Page Number


LIST OF FIGURES

Figure 1
Name of Figure
Page Number
Figure 2
Name of Figure
Page Number




ABSTRACT
With the rapid growth of social media platforms, users frequently share text, images, and documents without fully considering the privacy implications of the information being disclosed. Such oversharing can unintentionally expose sensitive personal information, including identity documents, financial details, contact information, addresses, confidential documents, and other personally identifiable information (PII). Existing social media platforms primarily focus on content moderation after publication and offer limited mechanisms to proactively warn users about potential privacy risks before content is shared.
This project presents a Privacy Analyzer for Social Media Platforms, an intelligent browser extension designed to analyze user-generated content before it is published. The proposed system performs real-time privacy analysis on both textual and visual content to identify sensitive information that may lead to privacy breaches. For text analysis, a locally hosted language model is employed to detect personally identifiable information and context-specific privacy risks while preserving user privacy. For image analysis, a Vision-Language Model (VLM), namely Qwen2.5-VL-7B, is integrated through a headless LM Studio server to recognize privacy-sensitive elements such as identity cards, passports, driving licenses, bank cards, QR codes, certificates, handwritten personal information, addresses, signatures, and other confidential visual content.
The system combines the outputs of both analysis pipelines to generate a comprehensive privacy risk assessment. Based on the detected information, it assigns an overall risk level and provides contextual warnings and actionable recommendations, allowing users to review or modify their content before posting. The architecture emphasizes privacy-preserving processing by executing inference locally whenever possible while supporting scalable deployment through API-based model integration for advanced image analysis.
The proposed solution aims to reduce accidental privacy leaks, increase user awareness regarding digital privacy, and encourage safer online sharing practices without disrupting the normal user experience. By integrating modern Large Language Models (LLMs) and Vision-Language Models (VLMs) into a lightweight browser extension, the project demonstrates a practical and scalable approach to proactive privacy protection across social media platforms.











Chapter 1: Introduction

Background

The rapid growth of social media platforms has transformed the way people communicate and share information. Millions of users upload text, images, videos, and documents every day on platforms such as Facebook, Instagram, LinkedIn, and WhatsApp. While these platforms provide convenience and global connectivity, they also increase the risk of exposing personal and confidential information to a wide audience.

Many users unintentionally share Personally Identifiable Information (PII), including phone numbers, email addresses, residential addresses, identity documents, financial details, QR codes, and confidential documents. Images may also reveal sensitive information such as identity cards, certificates, signatures, or computer screens displaying private data. Once such information is published online, it can be copied, misused, or permanently stored, making it difficult to remove completely.

Recent advancements in Artificial Intelligence (AI), particularly Large Language Models (LLMs) and Vision-Language Models (VLMs), have made it possible to automatically identify sensitive information in both text and images. The proposed Privacy Analyzer for Social Media Platforms utilizes these technologies to examine user-generated content before it is posted. By detecting privacy-sensitive information and providing timely warnings, the system helps users make informed decisions and reduces the chances of accidental privacy leakage while maintaining a seamless social media experience.

1.2 Problem Statement
Social media users frequently share personal information without realizing that their posts may contain sensitive data. Text, images, screenshots, and documents often include Personally Identifiable Information (PII) such as phone numbers, email addresses, identity documents, financial information, residential addresses, QR codes, and signatures. Once this information is published online, it can be accessed by unauthorized individuals and misused for identity theft, phishing, fraud, or other cybercrimes.

Although social media platforms provide privacy settings and content moderation features, they generally do not analyze user-generated content for privacy risks before it is posted. Existing privacy tools mainly rely on rule-based methods or keyword matching, which are often unable to understand the context of the content or detect sensitive information embedded within images.

Therefore, there is a need for an intelligent system that can automatically analyze both text and images before publication. The proposed Privacy Analyzer addresses this need by using AI-based language and vision models to detect privacy-sensitive information, evaluate the level of risk, and provide appropriate warnings and recommendations. This enables users to review their content before posting and significantly reduces the chances of accidental disclosure of confidential information.

1.3 Motivation
The increasing use of social media has made sharing information easier than ever, but it has also increased the risk of exposing personal and confidential data. Many users unknowingly upload posts containing sensitive information such as identity cards, financial details, contact information, official documents, or personal photographs. Such accidental disclosures can lead to identity theft, financial fraud, cyberstalking, and other privacy-related threats.
Existing social media platforms mainly focus on content moderation and user privacy settings rather than preventing privacy leaks before content is published. As a result, users often realize their mistake only after the information has already been shared. This highlights the need for a proactive solution that can identify privacy risks in real time and alert users before the content becomes publicly accessible.
The motivation behind this project is to develop an AI-powered Privacy Analyzer that assists users in protecting their personal information. By analyzing both textual and visual content before publication, the system increases user awareness, promotes responsible online sharing, and helps minimize accidental privacy breaches without interrupting the normal social media experience.

1.4 Objectives

The primary objective of this project is to develop an intelligent Privacy Analyzer for Social Media Platforms that assists users in identifying and preventing the accidental disclosure of sensitive information before it is published online. The system is designed to analyze both textual and visual content in real time and provide users with meaningful privacy-related warnings and recommendations without disrupting their normal browsing experience.
The specific objectives of the proposed system are as follows:
To develop a browser extension capable of monitoring user-generated content before it is posted on social media platforms.
To detect Personally Identifiable Information (PII) such as names, phone numbers, email addresses, residential addresses, financial details, and other confidential information present in textual content.
To analyze uploaded images using Artificial Intelligence techniques and identify privacy-sensitive elements, including identity cards, passports, driving licenses, bank cards, QR codes, certificates, handwritten notes, signatures, and confidential documents.
To integrate Large Language Models (LLMs) for contextual text analysis and Vision-Language Models (VLMs) for intelligent image understanding, enabling accurate detection of privacy risks.
To generate a privacy risk score based on the detected sensitive information and classify the content into appropriate risk levels.
To provide users with clear warnings, explanations, and recommendations, allowing them to review or modify their content before publication.
To preserve user privacy by performing content analysis locally whenever possible while supporting API-based model integration for advanced image analysis.
To develop a lightweight, user-friendly solution that can be easily integrated into modern web browsers without affecting the overall user experience.
By achieving these objectives, the proposed Privacy Analyzer aims to minimize accidental privacy leaks, improve user awareness regarding digital privacy, and promote responsible sharing of information across social media platforms.

1.5 Scope of the Project

The scope of the proposed Privacy Analyzer is to provide proactive privacy protection for users while sharing content on social media platforms. The system focuses on analyzing text and images before they are published, helping users identify sensitive information that may lead to unintended privacy breaches.
The project includes a browser extension that captures user-generated content and performs AI-based analysis. The text analysis module detects Personally Identifiable Information (PII), such as names, phone numbers, email addresses, addresses, and financial details, while the image analysis module identifies privacy-sensitive objects such as identity cards, passports, bank cards, QR codes, certificates, signatures, and confidential documents. Based on the detected information, the system calculates a privacy risk level and provides appropriate warnings and recommendations.
The current implementation is intended for supported web-based social media platforms and focuses on pre-publication privacy analysis. Features such as video analysis, multilingual support, and advanced personalized privacy recommendations are beyond the scope of the current project and are considered potential future enhancements. This scope ensures that the proposed system effectively addresses the most common forms of accidental privacy leakage in online social networking.

1.6 Proposed Solution Overview

The proposed solution is an AI-powered Privacy Analyzer implemented as a browser extension that helps users identify privacy risks before publishing content on social media platforms. The system automatically analyzes both text and images in real time and alerts users if sensitive information is detected.

When a user creates a post, the browser extension captures the textual content and any attached images. The text is analyzed using a Large Language Model (LLM) to identify Personally Identifiable Information (PII) and other confidential data. At the same time, uploaded images are examined using a Vision-Language Model (VLM) to detect sensitive visual elements such as identity cards, bank cards, QR codes, certificates, signatures, and official documents. The outputs from both modules are combined to determine the overall privacy risk associated with the content.
If a potential privacy leak is identified, the system displays a warning along with recommendations that allow the user to review, edit, or remove sensitive information before posting. This proactive approach improves user awareness, minimizes accidental information disclosure, and enhances online privacy while maintaining a smooth and user-friendly experience.

1.7 Organization of the Report

This report is organized into six chapters, each describing a specific aspect of the proposed Privacy Analyzer for Social Media Platforms. Chapter 1 introduces the project by discussing the background, problem statement, motivation, objectives, scope, and an overview of the proposed solution.
Chapter 2 presents a review of existing research and technologies related to privacy protection, social media security, browser extensions, Large Language Models (LLMs), and Vision-Language Models (VLMs). It also identifies the research gap that motivates the proposed system.
Chapter 3 explains the system design and architecture, including the overall workflow, functional modules, browser extension architecture, and technology stack. Chapter 4 describes the implementation details and key features of the system, highlighting the integration of AI models for text and image analysis.
Chapter 5 focuses on system testing and evaluation, discussing the testing methodology, experimental results, and performance analysis. Finally, Chapter 6 summarizes the project, highlights its contributions and limitations, and outlines possible future enhancements for improving the Privacy Analyzer.

Chapter 2: Literature Review

2.1 Introduction

The literature review provides an understanding of the existing research, technologies, and solutions related to privacy protection in social media. With the increasing use of online platforms, protecting personal information has become an important area of research. Several studies have focused on detecting Personally Identifiable Information (PII), preventing data leakage, and improving user awareness through intelligent privacy protection systems.
Traditional privacy protection methods mainly rely on rule-based techniques, keyword matching, or predefined patterns to identify sensitive information. Although these methods are simple to implement, they often fail to understand the context of the content and may produce inaccurate results. Recent advancements in Artificial Intelligence (AI), particularly Large Language Models (LLMs) and Vision-Language Models (VLMs), have significantly improved the ability to analyze both textual and visual information with greater accuracy.
This chapter reviews the existing approaches, discusses their strengths and limitations, and highlights the research gap that led to the development of the proposed Privacy Analyzer for Social Media Platforms. The review also provides the theoretical foundation for selecting AI-based techniques to detect privacy-sensitive information before it is shared online.



2.2 Privacy Issues in Social Media

Social media platforms have become one of the primary means of communication and information sharing. However, the widespread use of these platforms has also increased the risk of privacy breaches. Users often post personal information, photographs, documents, and location details without realizing that such content may expose sensitive data to unauthorized individuals.
Common privacy issues include the accidental disclosure of Personally Identifiable Information (PII), identity theft, phishing attacks, cyberstalking, financial fraud, and misuse of personal photographs. Images may also reveal confidential information such as identity cards, certificates, QR codes, bank cards, or computer screens containing sensitive data. Once shared online, this information can be copied, redistributed, and stored permanently, making it difficult to remove completely.
Although social media platforms provide privacy settings and access controls, these features depend largely on user awareness and do not actively identify privacy risks before content is published. Therefore, intelligent systems capable of analyzing user-generated content before posting are becoming increasingly important. Such solutions can help users recognize potential privacy threats and make informed decisions before sharing information online.

2.3 Personally Identifiable Information (PII)

Personally Identifiable Information (PII) refers to any data that can be used to identify an individual either directly or indirectly. Protecting PII is an essential aspect of information security and digital privacy, as unauthorized disclosure can lead to identity theft, financial fraud, and other cybercrimes. With the increasing use of social media, users often share PII unknowingly through text, images, or documents.

Common examples of PII include names, phone numbers, email addresses, residential addresses, dates of birth, government-issued identification numbers, passport details, bank account information, credit or debit card details, and biometric information. Images may also contain PII in the form of identity cards, certificates, signatures, handwritten notes, or QR codes that reveal personal information.

Traditional methods of detecting PII mainly rely on predefined rules and regular expressions, which may fail to identify context-dependent information. Recent AI-based approaches use Large Language Models (LLMs) and Vision-Language Models (VLMs) to understand the meaning and context of both textual and visual content, resulting in more accurate detection. These advancements provide the foundation for developing intelligent privacy protection systems capable of identifying sensitive information before it is shared online.


2.4 Existing Privacy Protection Mechanisms

Existing privacy protection mechanisms on social media platforms mainly focus on providing users with privacy settings, account security features, and content moderation tools. These mechanisms allow users to control who can view their posts, enable two-factor authentication, report inappropriate content, and manage personal information. While these features improve account security, they do not actively prevent users from accidentally sharing sensitive information.
Several privacy tools and browser extensions have also been developed to block advertisements, prevent online tracking, and enhance browsing security. However, most of these solutions rely on predefined rules or keyword-based filtering and are unable to analyze the actual content of a post before it is published. As a result, confidential information contained in text or images may still be unintentionally shared.
Recent research has introduced AI-based privacy protection systems that utilize machine learning and deep learning techniques to identify sensitive information. These systems offer improved detection accuracy by understanding the context of user-generated content. Nevertheless, many existing solutions focus only on text or images individually and lack an integrated approach for analyzing both forms of content simultaneously. This limitation highlights the need for a comprehensive AI-powered privacy analyzer capable of detecting privacy risks across multiple content types before publication.

2.5 Browser Extensions for Security and Privacy

Browser extensions have become widely used tools for improving online security and enhancing user privacy. They provide additional functionalities that are not available in standard web browsers, such as advertisement blocking, password management, tracker prevention, malicious website detection, and secure browsing. Since browser extensions operate directly within the browser, they can monitor web pages and interact with user activities in real time.
Several privacy-focused extensions, including ad blockers and anti-tracking tools, help protect users from online surveillance and unwanted data collection. However, these extensions primarily focus on website behavior rather than analyzing the content created by users. They do not detect sensitive personal information that may be present in text, images, or documents before a social media post is published.
Recent developments in browser extension technology have enabled the integration of Artificial Intelligence for advanced content analysis. By combining browser APIs with AI models, extensions can automatically inspect user-generated content and identify potential privacy risks. This approach allows users to receive immediate warnings before sharing sensitive information, making browser extensions an effective platform for implementing proactive privacy protection systems such as the proposed Privacy Analyzer.

2.6 Large Language Models for Text Privacy Analysis

Large Language Models (LLMs) are advanced Artificial Intelligence models trained on vast amounts of textual data to understand, generate, and analyze natural language. Unlike traditional Natural Language Processing (NLP) techniques that rely primarily on handcrafted rules or statistical methods, LLMs learn contextual relationships between words, phrases, and sentences. This enables them to interpret the meaning of text more accurately and perform complex language understanding tasks such as text classification, question answering, summarization, information extraction, and entity recognition.
In the field of privacy protection, LLMs have shown significant potential for identifying Personally Identifiable Information (PII) and other sensitive content. Traditional detection methods typically depend on keyword matching, regular expressions, or predefined dictionaries, making them effective only for structured information such as phone numbers, email addresses, or identification numbers. However, these approaches often fail when sensitive information is expressed indirectly or requires contextual understanding. For example, a sentence describing a person's workplace, travel plans, or financial situation may reveal private information even if it contains no obvious keywords.
LLMs address this limitation by analyzing the semantic meaning and context of the entire text rather than individual words. They can recognize relationships between different pieces of information and determine whether a passage contains privacy-sensitive content. This contextual reasoning enables more accurate detection of confidential information, reduces false positives, and improves the overall reliability of privacy analysis systems. Additionally, LLMs can provide explanations and recommendations that help users understand why specific content may pose a privacy risk.
Recent research has demonstrated the effectiveness of transformer-based language models in tasks such as Named Entity Recognition (NER), sensitive information detection, document analysis, and automated privacy assessment. Their ability to process unstructured text makes them particularly suitable for analyzing social media posts, emails, messages, and documents, where information is often expressed in informal or conversational language.
The proposed Privacy Analyzer for Social Media Platforms utilizes the capabilities of Large Language Models to perform intelligent analysis of user-generated text before it is published. Instead of relying solely on predefined rules, the system evaluates the contextual meaning of the content to identify potential privacy risks and detect sensitive information more accurately. By integrating AI-driven text analysis into a browser extension, the proposed system provides users with timely privacy warnings and recommendations, helping them make informed decisions while sharing content online.

2.7 Vision-Language Models (VLMs) for Image Privacy Analysis

Vision-Language Models (VLMs) are a class of multimodal Artificial Intelligence models that combine computer vision and natural language processing to understand and interpret visual content. Unlike traditional image classification models that identify predefined object categories, VLMs can analyze the semantic content of an image, recognize relationships between objects, and generate descriptive textual interpretations. This capability enables them to perform complex tasks such as image captioning, visual question answering, document understanding, object detection, and scene analysis.
The ability of VLMs to jointly process images and textual information makes them highly suitable for privacy-related applications. Images shared on social media often contain sensitive information that is difficult to detect using conventional computer vision techniques. Examples include government-issued identity cards, passports, driving licenses, bank cards, certificates, handwritten notes, QR codes, signatures, medical reports, confidential documents, and computer screens displaying personal information. Detecting these elements requires not only object recognition but also an understanding of the context in which they appear.
Traditional image-processing methods primarily depend on handcrafted features or object detection algorithms trained to recognize a limited set of categories. While these approaches perform well in controlled environments, they often struggle with complex scenes, partially visible documents, varying image quality, or unfamiliar object layouts. In contrast, Vision-Language Models learn from large-scale image-text datasets, allowing them to generalize across diverse visual scenarios and understand the relationship between visual elements and their semantic meaning.
Recent advancements in multimodal AI have significantly improved the capability of Vision-Language Models to analyze real-world images with high accuracy. These models can identify privacy-sensitive objects, interpret textual information present within images, and generate contextual descriptions that assist in determining whether an image poses a privacy risk. Such capabilities make VLMs valuable for applications involving document verification, visual content moderation, accessibility, and intelligent privacy analysis.
In the proposed Privacy Analyzer for Social Media Platforms, Vision-Language Models play a central role in detecting privacy-sensitive visual content before it is shared online. The image analysis module examines uploaded images to identify confidential documents, identity cards, financial information, QR codes, certificates, handwritten personal details, signatures, and other sensitive visual elements. The results obtained from the visual analysis are combined with the text analysis module to produce a comprehensive privacy risk assessment. This multimodal approach enables the system to identify a wider range of privacy threats than conventional image-processing techniques and provides users with meaningful warnings before content is published.

2.8 Review of Existing Research

Several research studies have explored the use of Artificial Intelligence for detecting privacy-sensitive information in digital content. Early approaches primarily relied on rule-based systems, regular expressions, and machine learning algorithms to identify Personally Identifiable Information (PII) in text. While these methods were effective for structured data, they often struggled to understand context and produced inaccurate results when dealing with complex or unstructured content.
Recent advancements in deep learning have led to the development of Large Language Models (LLMs) and Vision-Language Models (VLMs), which provide improved performance in understanding both textual and visual information. These models can identify sensitive entities, interpret contextual meaning, and recognize confidential objects within images more accurately than traditional techniques. Researchers have also explored AI-assisted browser extensions and privacy monitoring tools to enhance user awareness before information is shared online.
Despite these developments, many existing solutions focus on either text or image analysis independently. Only a limited number of systems integrate both modalities into a single platform capable of providing comprehensive privacy risk assessment. This observation highlights the need for an integrated AI-powered solution that analyzes both text and images simultaneously, forming the basis of the proposed Privacy Analyzer.

2.9 Research Gap

The literature review indicates that existing privacy protection solutions have several limitations. Most social media platforms depend on user awareness and manual privacy settings, which do not prevent accidental sharing of sensitive information before publication. Similarly, many browser extensions focus on advertisement blocking, tracker prevention, or website security rather than analyzing user-generated content for privacy risks.

Although recent AI-based methods have improved the detection of Personally Identifiable Information (PII), many existing systems analyze only text or only images. Very few solutions combine both text and image analysis to provide a comprehensive privacy assessment. In addition, some AI-based tools rely heavily on cloud processing, raising concerns about data security and user privacy.

The proposed Privacy Analyzer addresses these gaps by integrating Large Language Models (LLMs) and Vision-Language Models (VLMs) within a browser extension to analyze both textual and visual content before it is published. The system performs real-time privacy analysis, generates an overall risk assessment, and provides users with clear warnings and recommendations. This integrated approach enhances privacy protection while promoting safer and more responsible use of social media platforms.

2.10 Summary

This chapter reviewed the existing studies and technologies related to privacy protection in social media, Personally Identifiable Information (PII), browser-based privacy solutions, and AI-driven content analysis. The review highlighted the strengths and limitations of traditional privacy protection mechanisms as well as recent advancements in Large Language Models (LLMs) and Vision-Language Models (VLMs) for detecting sensitive information.
The analysis showed that while current solutions have improved privacy protection, most focus on either textual or visual content independently and provide limited support for preventing privacy leaks before content is published. These limitations emphasize the need for a comprehensive system capable of analyzing both text and images in real time.
Based on these findings, the proposed Privacy Analyzer integrates AI-powered text and image analysis within a browser extension to identify privacy-sensitive information, assess potential risks, and notify users before they share content online. The next chapter describes the system design and architecture of the proposed solution, explaining its workflow, functional modules, and overall implementation approach.
Chapter 3: System Design and Architecture

3.1 Introduction

The design and architecture of a system determine how its individual components interact to achieve the desired functionality efficiently and reliably. For the proposed Privacy Analyzer for Social Media Platforms, the architecture is designed to perform real-time privacy analysis of both textual and visual content before it is published on social media. The system is implemented as a browser extension, allowing it to integrate seamlessly with popular web-based social media platforms without requiring modifications to the platforms themselves.
The proposed architecture follows a modular approach, where each component is responsible for a specific task, including content collection, text analysis, image analysis, privacy risk assessment, and user notification. This modular design improves maintainability, scalability, and future extensibility. The text analysis module identifies sensitive information from user-written content, while the image analysis module detects confidential objects and visual Personally Identifiable Information (PII) within uploaded images. The outputs from these modules are combined to generate an overall privacy risk score.
The architecture emphasizes user privacy by performing analysis locally whenever possible and minimizing external data transmission. Through this design, the system provides timely warnings and actionable recommendations, enabling users to make informed decisions before sharing content online.

3.2 System Overview
The Privacy Analyzer for Social Media Platforms is designed as an intelligent browser extension that examines user-generated content before it is posted on social media websites. The primary objective of the system is to identify sensitive personal information and notify users about potential privacy risks, enabling them to make informed decisions before publishing their content.
The system consists of multiple interconnected modules that work together to perform privacy analysis. When a user creates a post, the browser extension captures the textual content and any attached images. The text is processed by a language model to identify Personally Identifiable Information (PII), confidential information, and context-based privacy risks. Simultaneously, uploaded images are analyzed using a Vision-Language Model (VLM) to detect sensitive objects such as identity cards, passports, bank cards, QR codes, certificates, handwritten information, and other confidential visual elements.
The outputs of both analysis modules are forwarded to the Privacy Risk Assessment Engine, which evaluates the severity of the detected information and assigns an overall risk level. Based on this assessment, the system generates clear warnings and recommendations through the extension interface. Users can then choose to edit, remove, or proceed with sharing the content.
The modular architecture ensures that additional AI models, detection capabilities, or supported platforms can be integrated in the future without requiring major modifications to the overall system.

           User Creates Social Media Post
                            │
                            ▼
                 Browser Extension Activated
                           │
          ┌────────────────┴────────────────┐
          ▼                                                                                           ▼
 Text Privacy Analysis Module      Image Privacy Analysis Module
          │                                                                                             │
          └────────────────┬────────────────┘
                                                          ▼
              Privacy Risk Assessment Engine
                           │
                           ▼
         Risk Score + Warning + Recommendation
                           │
                           ▼
              User Reviews Before Posting
                           │
                           ▼
                    Publish / Edit / Cancel


3.3 Functional Requirements

Functional requirements define the core operations and services that the proposed system must perform to achieve its intended objectives. The Privacy Analyzer for Social Media Platforms is designed to monitor user-generated content, analyze it for privacy risks, and provide timely feedback before the content is published. The primary functional requirements of the system are described below.
1. User Content Monitoring:The system shall monitor text entered and images uploaded by users on supported social media platforms. Content is analyzed only before submission to identify potential privacy risks.
2. Text Privacy Analysis:The system shall analyze textual content to detect Personally Identifiable Information (PII), confidential information, and context-dependent privacy risks. The analysis should identify sensitive information even when it is expressed in natural or conversational language.
3. Image Privacy Analysis:The system shall examine uploaded images to detect privacy-sensitive visual elements such as identity cards, passports, driving licenses, bank cards, certificates, QR codes, handwritten notes, signatures, and confidential documents.
4. Multimodal Privacy Assessment:The system shall combine the outputs of both text and image analysis modules to generate a comprehensive assessment of the privacy risks associated with the content being shared.
5. Privacy Risk Classification:Based on the detected information, the system shall assign an appropriate privacy risk level (for example, Low, Medium, or High) to indicate the severity of the potential privacy exposure.
6. Warning and Recommendation Generation:The system shall provide users with clear warnings explaining the detected privacy risks and recommend appropriate actions, such as removing sensitive information, blurring confidential regions, or reviewing the content before posting.
7. Browser Extension Integration:The system shall operate as a browser extension and integrate seamlessly with social media websites without requiring modifications to the platforms themselves.
8. User Decision Support:The system shall assist users by providing privacy-related recommendations while allowing them to make the final decision regarding whether to publish, modify, or discard the content.
9. AI Model Integration:The system shall support integration with Artificial Intelligence models for both text and image analysis through standardized interfaces, enabling future model upgrades without major architectural changes.
10. Result Presentation:The system shall display privacy analysis results through a simple and user-friendly interface, ensuring that warnings are easy to understand and do not unnecessarily interrupt the user's workflow.
These functional requirements collectively ensure that the proposed Privacy Analyzer performs comprehensive privacy analysis while maintaining usability, flexibility, and efficiency. They also establish the foundation for the system architecture and implementation discussed in the subsequent sections of this report.

3.4 Non-Functional Requirements
The non-functional requirements describe the quality attributes that ensure the Privacy Analyzer for Social Media Platforms operates efficiently, reliably, and securely. These requirements focus on the system's performance, usability, scalability, and privacy rather than its core functionalities.
The system should provide real-time analysis with minimal response time so that users receive privacy warnings without noticeable delays while composing social media posts. The browser extension should have a lightweight design and consume minimal system resources to ensure smooth operation across different devices and browsers.
Security and privacy are key considerations in the proposed system. User data should be processed locally whenever possible, and any communication with external AI services should be secure to prevent unauthorized access or data leakage. The system should also avoid permanently storing user-generated content unless explicitly required by the user.
The architecture should be modular, allowing future integration of improved AI models, additional privacy detection features, and support for more social media platforms without major modifications. Furthermore, the user interface should be simple and intuitive, enabling users to understand privacy warnings and recommendations easily, regardless of their technical background.
By satisfying these non-functional requirements, the proposed system aims to deliver a reliable, scalable, and user-friendly privacy protection solution for everyday social media usage.

Table 3.1: Functional and Non-Functional Requirements Summary
Functional Requirements
Non-Functional Requirements
Text Analysis
Performance
Image Analysis
Reliability
Risk Assessment
Security
Warning Generation
Privacy
Browser Integration
Scalability
User Interaction
Usability
AI Model Integration
Maintainability
Result Display
Compatibility & Availability


3.5 Overall System Architecture

The Privacy Analyzer for Social Media Platforms follows a modular and layered architecture that enables efficient privacy analysis while maintaining flexibility, scalability, and ease of maintenance. The architecture is designed to intercept user-generated content before publication, analyze both textual and visual information using Artificial Intelligence models, assess the overall privacy risk, and present meaningful recommendations to the user through an intuitive browser interface.
The system begins with the Browser Extension Layer, which serves as the primary interface between the user and the privacy analysis engine. As users compose a post or upload images on supported social media platforms, the extension captures the content before it is submitted. This layer is responsible for interacting with web pages, collecting user-generated data, and coordinating communication with the remaining system components.
The captured content is forwarded to two independent analysis modules. The Text Privacy Analysis Module processes textual information to identify Personally Identifiable Information (PII), confidential data, and context-dependent privacy risks. Simultaneously, the Image Privacy Analysis Module examines uploaded images to detect sensitive visual elements such as identity documents, bank cards, certificates, QR codes, handwritten notes, signatures, and confidential documents. Since both modules operate independently, text and image analysis can be performed simultaneously, reducing the overall processing time.
The outputs from these analysis modules are transmitted to the Privacy Risk Assessment Engine. This component consolidates the detected information, evaluates the severity of the identified privacy risks, and computes an overall privacy risk level. The assessment considers both textual and visual findings to generate a unified evaluation of the content being prepared for publication.
Based on the calculated risk level, the Warning and Recommendation Module generates user-friendly notifications explaining the detected privacy concerns and suggesting corrective actions. Depending on the identified risks, users may be advised to remove sensitive information, blur confidential sections of an image, edit specific portions of the text, or carefully review the content before posting. The final decision to publish, modify, or discard the content always remains with the user.
The modular architecture provides several advantages, including independent development of system components, simplified maintenance, improved scalability, and easier integration of future technologies. As Artificial Intelligence models continue to evolve, newer language models, vision-language models, or additional privacy detection modules can be incorporated into the existing framework without requiring major architectural modifications. This design ensures that the proposed Privacy Analyzer remains adaptable, efficient, and capable of addressing emerging privacy challenges across different social media platforms.

3.6 Browser Extension Architecture

The proposed Privacy Analyzer for Social Media Platforms is implemented as a browser extension that integrates directly with modern web browsers. This approach enables the system to operate independently of any specific social media platform while providing real-time privacy analysis during normal browsing activities. The browser extension acts as an intermediary between the user, the social media webpage, and the Artificial Intelligence analysis modules.
The extension follows a modular architecture consisting of several components that work together to monitor user interactions, collect content for analysis, communicate with the AI services, and display privacy warnings. The primary components include the Manifest File, Content Script, Background Service Worker, Popup Interface, and Message Passing Mechanism.
The Manifest File serves as the configuration file of the extension. It defines the permissions required by the extension, specifies the scripts to be executed, identifies the websites on which the extension is active, and registers the background service worker and user interface components. This file acts as the entry point for the browser extension and ensures that all modules operate with the required privileges.
The Content Script is injected into supported web pages and is responsible for interacting directly with the Document Object Model (DOM). It detects user activities such as entering text, selecting images, or preparing posts for publication. Before the content is submitted, the content script extracts the relevant textual and visual data and forwards it to the background service worker for further processing.
The Background Service Worker functions as the central controller of the extension. It coordinates communication between the content script, Artificial Intelligence models, and the popup interface. The background service worker manages analysis requests, invokes the text and image privacy analysis modules, processes their responses, and generates a consolidated privacy assessment. By centralizing these operations, the extension maintains efficient resource utilization and supports asynchronous processing.
The Popup Interface provides an interactive environment through which users can view the privacy analysis results. It presents detected sensitive information, privacy risk levels, and recommended actions in a clear and user-friendly format. Rather than blocking user actions, the interface assists users in making informed decisions before publishing their content.
Communication among these components is achieved through a secure Message Passing Mechanism, allowing different parts of the extension to exchange information efficiently without direct dependencies. This modular communication strategy improves maintainability, simplifies debugging, and enables future enhancements such as support for additional AI models, browser compatibility, or advanced privacy analysis features.
The browser extension architecture provides a lightweight, scalable, and platform-independent solution for proactive privacy protection. By integrating directly into the browsing environment, it enables seamless real-time analysis while preserving a smooth and uninterrupted user experience.

3.7 Text Analysis Module

The Text Analysis Module is responsible for examining the textual content entered by the user before it is published on a social media platform. Its primary objective is to identify Personally Identifiable Information (PII) and other privacy-sensitive content that may lead to accidental information disclosure.
When the browser extension captures the text from a post, it is preprocessed to remove unnecessary formatting and prepare it for analysis. The processed text is then passed to an AI-based Large Language Model (LLM), which understands the context of the content rather than relying solely on predefined keywords. This enables the system to detect sensitive information such as names, phone numbers, email addresses, residential addresses, financial details, government identification numbers, passwords, and other confidential information.
After analysis, the module categorizes the detected information based on its sensitivity and generates a structured output containing the identified entities, their corresponding risk levels, and confidence scores. These results are forwarded to the Privacy Risk Assessment Engine, where they are combined with the image analysis results to determine the overall privacy risk.
By leveraging contextual understanding through modern language models, the Text Analysis Module provides more accurate and reliable detection than traditional rule-based or keyword-matching approaches, thereby helping users prevent unintended disclosure of sensitive textual information.

3.8 Image Analysis Module

The Image Analysis Module is designed to detect privacy-sensitive information present in images attached to social media posts. Unlike traditional image classification systems, this module utilizes a Vision-Language Model (VLM) capable of understanding both the visual content and its contextual meaning. This enables the system to identify a wide range of sensitive objects that may pose privacy risks.
When a user uploads an image, the browser extension securely forwards it to the image analysis pipeline. The image is then processed by the Vision-Language Model, which examines its contents for privacy-related elements such as identity cards, passports, driving licenses, bank cards, certificates, QR codes, handwritten personal information, signatures, official documents, computer screens displaying confidential data, and other visually identifiable sensitive information.
The model generates a structured response describing the detected objects, their approximate locations within the image, confidence levels, and associated privacy risks. These results are then forwarded to the Privacy Risk Assessment Engine, where they are combined with the text analysis output to produce a unified privacy assessment.
By analyzing images before they are published, the module helps users recognize information that may otherwise go unnoticed, significantly reducing the chances of accidental exposure of confidential or personally identifiable visual content on social media platforms.

3.9 Risk Assessment Engine

The Risk Assessment Engine is the central component of the proposed system that combines the outputs from the Text Analysis Module and the Image Analysis Module to determine the overall privacy risk associated with a social media post. Its primary function is to evaluate the severity of detected sensitive information and present users with a clear and meaningful assessment before the content is published.
The engine receives structured results from both analysis modules, including the detected privacy-sensitive entities, confidence scores, and corresponding risk categories. It then applies predefined evaluation rules to calculate an overall privacy risk level, which is classified into categories such as Low, Medium, or High. The assessment considers factors such as the type of sensitive information detected, the quantity of exposed data, and the combined impact of multiple privacy risks within the same post.
Based on the calculated risk level, the engine generates appropriate warning messages and personalized recommendations. For example, it may advise users to blur sensitive regions in an image, remove confidential text, or reconsider sharing the content altogether. The final assessment is transmitted to the browser extension interface, where it is displayed in an easy-to-understand format.
By consolidating the results of multiple AI models into a single privacy score, the Risk Assessment Engine enables users to quickly understand the potential consequences of sharing their content and take corrective action before publication.

3.10 User Interface Design

The User Interface (UI) of the Privacy Analyzer is designed to provide a simple, intuitive, and non-intrusive experience for users while interacting with social media platforms. Since the system operates as a browser extension, the interface is integrated seamlessly into the user's browsing environment without disrupting the normal posting workflow.
The extension displays a popup window and in-page notifications whenever a potential privacy risk is detected. The popup presents a summary of the analysis, including the detected sensitive information, the overall privacy risk level, and recommended actions. Different visual indicators, such as color-coded risk levels (Low, Medium, and High), help users quickly understand the severity of the detected privacy issues.
Users are provided with clear recommendations, such as removing sensitive text, blurring confidential information in images, or reviewing the content before posting. The interface also allows users to proceed with publishing if they choose to ignore the warning, ensuring that the final decision remains under the user's control.
The UI is designed with responsiveness and accessibility in mind, making it easy to use across different screen sizes and browsers. By presenting privacy warnings in a clear and user-friendly manner, the interface improves user awareness and encourages safer sharing of content on social media platforms.

3.11 Workflow of the Proposed System

The workflow of the proposed Privacy Analyzer begins when a user creates a post on a supported social media platform. As the user types text or uploads images, the browser extension detects the content and prepares it for analysis before the post is submitted.
The extracted text is forwarded to the Text Analysis Module, where a Large Language Model (LLM) identifies Personally Identifiable Information (PII) and other privacy-sensitive textual content. At the same time, any uploaded images are processed by the Image Analysis Module using a Vision-Language Model (VLM) to detect sensitive visual elements such as identity documents, bank cards, QR codes, certificates, and handwritten personal information.
The outputs from both modules are then transmitted to the Risk Assessment Engine, which evaluates the detected information and calculates an overall privacy risk level. Based on the assessment, the system generates appropriate warnings and recommendations that are displayed through the browser extension interface.
After reviewing the analysis, the user can choose to modify the content, remove the detected sensitive information, or continue with the post. This workflow ensures that privacy analysis is completed before publication, allowing users to prevent accidental disclosure of confidential information while maintaining a smooth and efficient social media experience.

3.12 Use Case Diagram

A Use Case Diagram illustrates the interaction between the user and the Privacy Analyzer system, highlighting the major functionalities performed by the browser extension. The primary actor in the system is the User, who creates posts on supported social media platforms. The user interacts with the extension to analyze content, review privacy warnings, and decide whether to publish or modify the post.
The main use cases include creating a post, entering text, uploading images, initiating privacy analysis, detecting sensitive information, calculating the privacy risk score, displaying warnings and recommendations, and publishing or editing the content. During the analysis process, the browser extension communicates with the Text Analysis Module and the Image Analysis Module to evaluate the content before it is posted.
The Use Case Diagram demonstrates that the system operates automatically in the background while requiring minimal user interaction. Users receive timely notifications only when privacy-sensitive information is detected, ensuring a seamless and user-friendly experience.
Figure 3.1 presents the Use Case Diagram of the proposed Privacy Analyzer system, showing the interaction between the user and the major functional components.

3.13 Data Flow Diagram (DFD)
The Data Flow Diagram (DFD) represents the movement of data through the Privacy Analyzer system, illustrating how information is collected, processed, and presented to the user. It provides a clear understanding of how different modules interact to perform privacy analysis before a social media post is published.
The workflow begins when the user creates a post containing text and/or images on a supported social media platform. The browser extension captures the content and forwards it to the appropriate analysis modules. The Text Analysis Module examines the textual content to identify Personally Identifiable Information (PII) and other sensitive data, while the Image Analysis Module analyzes uploaded images for confidential visual information such as identity documents, QR codes, bank cards, and signatures.
The outputs from both modules are transmitted to the Risk Assessment Engine, which combines the results and determines the overall privacy risk level. Based on this evaluation, the system generates warnings and recommendations that are displayed through the browser extension interface. Finally, the user reviews the analysis and decides whether to modify the content or proceed with publishing.
Figure illustrates the Data Flow Diagram of the proposed system, showing the flow of information between the user, browser extension, analysis modules, and risk assessment ..


3.14 Sequence Diagram
The Sequence Diagram illustrates the chronological interaction between the user, browser extension, AI analysis modules, and the risk assessment engine during the privacy analysis process. It shows how each component communicates to analyze content before it is published on a social media platform.
The sequence begins when the user creates a post and clicks the Post button. The browser extension intercepts the request and extracts the textual content and uploaded images. The text is sent to the Text Analysis Module, while the images are forwarded to the Image Analysis Module. Both modules process the received data independently and return the detected privacy-sensitive information along with confidence scores.
The Risk Assessment Engine receives the outputs from both modules, combines the results, and calculates an overall privacy risk level. It then generates appropriate warnings and recommendations based on the severity of the detected information. Finally, the browser extension displays the analysis results to the user, who can either modify the content or continue with the posting process.
The Sequence Diagram clearly represents the order of interactions among different system components and demonstrates the real-time workflow of the proposed privacy analysis system.
Figure 3.3 illustrates the Sequence Diagram of the proposed Privacy Analyzer system.

3.15 Technology Stack
The proposed Privacy Analyzer for Social Media Platforms is developed using a combination of modern web technologies and Artificial Intelligence frameworks to ensure efficient, scalable, and reliable privacy analysis. The browser extension is built using HTML, CSS, and JavaScript, providing a lightweight and responsive user interface that integrates seamlessly with supported social media platforms. The extension utilizes browser APIs, including content scripts, background service workers, and messaging APIs, to monitor user interactions and coordinate the privacy analysis process.
The backend AI services are implemented in Python, which facilitates communication with machine learning models and API endpoints. For text analysis, the system employs a Large Language Model (LLM) to identify Personally Identifiable Information (PII) and contextual privacy risks. Image analysis is performed using the Qwen2.5-VL-7B Vision-Language Model (VLM), accessed through a headless LM Studio server exposed via an API for inference. During development and testing, Google Colab is used to host the model and provide GPU acceleration for efficient image processing.
Version control is managed using Git and GitHub, enabling collaborative development and code maintenance. Together, these technologies provide a robust platform for implementing an AI-powered privacy analysis system that is modular, extensible, and capable of supporting future enhancements.

CHAPTER 4: SYSTEM IMPLEMENTATION AND FEATURES
4.1 Introduction
The implementation of the proposed Privacy Analyzer for Social Media Platforms focuses on integrating a browser extension with Artificial Intelligence to detect privacy-sensitive information before users publish content on social media. The system combines modern web technologies with AI-based text and image analysis to provide real-time privacy assistance while maintaining a smooth user experience.
The browser extension is developed using React, TypeScript, and Chrome Manifest V3, whereas the backend is implemented using Python and the FastAPI framework. The backend communicates with AI models through REST APIs to analyze both textual and visual content. A Large Language Model (LLM) performs text analysis, while a Vision-Language Model (VLM) analyzes uploaded images. The outputs from both models are combined to generate an overall privacy risk assessment.
The implementation follows a modular architecture where the browser extension, backend services, AI models, and risk assessment engine operate independently. This approach improves scalability, simplifies maintenance, and supports future enhancements such as improved AI models and additional privacy detection capabilities.
This chapter explains the development environment, browser extension implementation, backend architecture, AI model integration, privacy detection modules, and the major features of the proposed system.


4.2 Development Environment
The proposed Privacy Analyzer was developed using modern web development tools and Artificial Intelligence frameworks to ensure efficient implementation and easy maintenance. The selected technologies provide high performance, modularity, and compatibility with browser extension development.
The frontend of the browser extension was developed using React and TypeScript, which provide a responsive user interface and improved code reliability. Visual Studio Code was used as the primary development environment because of its debugging features and extension support.
The backend was implemented using Python and the FastAPI framework. FastAPI enables fast API development, asynchronous request handling, and smooth communication between the browser extension and AI models. Artificial Intelligence models were integrated using the Hugging Face Transformers library along with PyTorch for model execution. Additional libraries such as OpenCV, Pillow, and NumPy were used for image preprocessing and data handling.
During development, the system was tested on Chromium-based browsers such as Google Chrome. Git and GitHub were used for version control and project management. The selected development environment provides a stable and scalable platform for implementing real-time privacy analysis while supporting future enhancements.

4.3 Software and Hardware Requirements
The proposed Privacy Analyzer requires both software and hardware resources for browser extension development, backend processing, and Artificial Intelligence model execution. The requirements vary depending on whether the AI models are executed locally or through a remote server.
The software environment includes Windows or Linux as the operating system, Google Chrome or another Chromium-based browser, Python 3.10 or above, Node.js, React, TypeScript, and the FastAPI framework. AI integration is supported using the Hugging Face Transformers library, PyTorch, OpenCV, Pillow, and NumPy. Git and Visual Studio Code are used for source code management and development.
For hardware, a system with at least an Intel Core i5 or equivalent processor, 8 GB RAM, and 20 GB of free storage is sufficient for development and browser testing. A dedicated GPU is recommended when running large AI models locally. Alternatively, computationally intensive models can be deployed on remote servers, reducing the hardware requirements of the local system.
The selected software and hardware configuration provides a reliable environment for implementing, testing, and deploying the proposed Privacy Analyzer while supporting future system enhancements.

4.4 Browser Extension Implementation
The proposed Privacy Analyzer is implemented as a Chrome browser extension based on the Manifest V3 architecture. The extension monitors user-generated content on supported social media platforms and performs privacy analysis before the content is published. It acts as an interface between the user, the browser, and the AI-powered backend services.
The extension consists of several components, including the Manifest file, Content Script, Background Service Worker, and Popup Interface. The Content Script captures text and image information from the webpage, while the Background Service Worker manages communication with the FastAPI backend. The Popup Interface displays the detected privacy risks, recommendations, and overall risk level in a simple and user-friendly format.
Communication between these components is carried out using Chrome's message-passing mechanism. The browser extension sends user content securely to the backend through REST APIs and receives structured analysis results. This modular implementation ensures efficient performance, easy maintenance, and supports the addition of new features or AI models in the future.

4.5 Backend Implementation
The backend of the proposed Privacy Analyzer is developed using Python and the FastAPI framework. It acts as the central processing unit of the system by receiving requests from the browser extension, coordinating AI-based analysis, and returning structured privacy assessment results.
When the browser extension sends user-generated text and images, the backend validates the input and forwards it to the appropriate analysis modules. The Text Analysis Module processes textual information using a Large Language Model (LLM), while the Image Analysis Module uses a Vision-Language Model (VLM) to examine uploaded images for privacy-sensitive content.
After the analysis is completed, the backend combines the results, calculates the overall privacy risk level, and generates recommendations for the user. The final output is returned as a structured JSON response, allowing the browser extension to display the detected privacy risks through its user interface. The modular backend architecture improves scalability and allows future integration of additional AI models and privacy detection techniques.

4.6 Artificial Intelligence Model Integration
Artificial Intelligence is the core component of the proposed Privacy Analyzer. The system integrates a Large Language Model (LLM) for text analysis and a Vision-Language Model (VLM) for image analysis to detect privacy-sensitive information before it is shared on social media.

The LLM analyzes user-generated text to identify Personally Identifiable Information (PII), contact details, financial information, addresses, and other confidential data. At the same time, the VLM examines uploaded images to detect identity documents, bank cards, certificates, QR codes, handwritten notes, signatures, and other sensitive visual content.
Both models communicate with the FastAPI backend through REST APIs and return structured analysis results. These results are combined by the Privacy Risk Assessment Engine to determine the overall privacy risk level. The modular AI integration allows the system to support both local and remote model deployment and makes it easier to upgrade AI models in the future without changing the overall system architecture.

4.7 Text Privacy Detection Implementation

The Text Privacy Detection Module is responsible for identifying sensitive information present in user-generated text before it is published on social media. The browser extension captures the text entered by the user and sends it to the FastAPI backend through a secure API request.
The backend preprocesses the received text by removing unnecessary spaces and validating the input format. The processed text is then analyzed using a Large Language Model (LLM), which identifies privacy-sensitive information such as names, phone numbers, email addresses, financial details, government identification numbers, and other confidential data based on the context of the text.
The detected information is converted into a structured format containing the privacy category, confidence level, and description. These results are forwarded to the Privacy Risk Assessment Engine, where they contribute to the overall privacy score. The modular design of the text analysis pipeline allows future improvements, including multilingual support and integration of more advanced language models.

4.8 Image Privacy Detection Implementation

The Image Privacy Detection Module analyzes uploaded images to identify visual information that may expose a user's privacy. When a user selects an image for uploading, the browser extension sends the image to the FastAPI backend for further processing.
Before analysis, the backend performs image preprocessing such as validating the image format and resizing it if necessary. The processed image is then analyzed using a Vision-Language Model (VLM), which detects privacy-sensitive objects including identity documents, bank cards, certificates, QR codes, signatures, handwritten notes, screenshots, and other confidential documents.
The detected visual elements are converted into a structured response containing the object category, confidence score, and severity level. These results are then combined with the text analysis findings by the Privacy Risk Assessment Engine to determine the overall privacy risk. The modular implementation allows the image analysis pipeline to support future enhancements such as OCR integration, multilingual document analysis, and newer vision-language models.


4.9 Privacy Risk Assessment Implementation

The Privacy Risk Assessment Module combines the results obtained from the text and image analysis modules to determine the overall privacy risk of a social media post. It receives structured outputs from both AI models and evaluates the detected sensitive information based on its type and severity.
Each detected privacy element is assigned a predefined weight according to its importance. Highly sensitive information such as identity documents, financial details, or authentication credentials contributes more to the final risk score than less sensitive information. The total score is then used to classify the content into Low, Medium, or High privacy risk levels.
After calculating the risk level, the system generates clear warnings and recommendations to help users reduce potential privacy exposure. The final assessment, including detected items, risk level, and suggested actions, is returned as a JSON response to the browser extension, where it is displayed through the popup interface. This implementation provides a simple, scalable, and effective method for evaluating privacy risks before content is published.


4.10 Features of the Proposed System

The proposed Privacy Analyzer provides several features that help users protect their personal information before sharing content on social media. The system performs real-time analysis of both text and images, allowing users to identify potential privacy risks before publishing their posts.
The text analysis module detects Personally Identifiable Information (PII), contact details, financial information, and other confidential data, while the image analysis module identifies sensitive visual content such as identity documents, bank cards, certificates, QR codes, signatures, and screenshots containing personal information. The outputs from both modules are combined to generate a unified privacy risk assessment.
The browser extension displays the overall risk level along with clear warnings and recommendations, enabling users to edit or remove sensitive information before posting. The system also supports both local and remote AI model deployment, making it flexible for different computing environments. Its modular architecture ensures easy maintenance and allows future enhancements such as improved AI models, multilingual support, and additional privacy detection capabilities.

4.11 Summary

This chapter presented the implementation and key features of the proposed Privacy Analyzer for Social Media Platforms. The system was developed using a browser extension integrated with a FastAPI backend and Artificial Intelligence models to perform real-time privacy analysis of both textual and visual content.
The implementation included the browser extension, backend services, AI model integration, text and image privacy detection modules, and the Privacy Risk Assessment Engine. These components work together to identify sensitive information, evaluate its severity, and provide meaningful recommendations before users publish their content.
The modular design adopted during implementation improves scalability, maintainability, and flexibility. It also supports future enhancements such as advanced AI models, multilingual analysis, and additional privacy detection features. Overall, the implemented system provides an effective solution for reducing accidental privacy disclosure on social media platforms.

The next chapter presents the testing and evaluation of the proposed system, including testing methodology, functional testing, performance evaluation, and analysis of the obtained results.

CHAPTER 5: SYSTEM TESTING AND EVALUATION

5.1 Introduction

System testing and evaluation are essential stages in software development that verify whether the implemented system meets its intended objectives. For the proposed Privacy Analyzer for Social Media Platforms, testing was performed to ensure that all modules function correctly and provide accurate privacy analysis for both textual and visual content.
The evaluation focuses on validating the interaction between the browser extension, backend services, Artificial Intelligence models, and the Privacy Risk Assessment Engine. Different types of tests were conducted to verify system functionality, response generation, and overall reliability. The results help determine whether the system can accurately detect privacy-sensitive information and generate appropriate recommendations before users publish their content.
This chapter presents the testing methodology, functional testing, test cases, performance evaluation, system limitations, and the overall effectiveness of the proposed Privacy Analyzer. The evaluation demonstrates that the implemented system successfully achieves its objective of assisting users in preventing accidental disclosure of sensitive information on social media platforms.

5.2 Testing Methodology

The proposed Privacy Analyzer was tested using a systematic approach to verify the functionality and performance of each module. Individual components, including the browser extension, backend services, text analysis module, image analysis module, and Privacy Risk Assessment Engine, were tested separately before evaluating the complete integrated system.
Functional testing was carried out by providing different types of text and image inputs containing both sensitive and non-sensitive information. The responses generated by the AI models were verified to ensure that privacy-sensitive content was correctly identified and classified. Communication between the browser extension and the FastAPI backend was also tested to confirm successful API requests and response handling.
In addition to functional testing, the integrated system was evaluated for response consistency, reliability, and usability. The generated privacy warnings, risk levels, and recommendations were reviewed to verify that they accurately reflected the detected privacy risks. This testing methodology ensured that the proposed system operated correctly and delivered meaningful privacy analysis before content was published.

5.3 Limitations

Although the proposed Privacy Analyzer provides effective privacy protection, it has certain limitations. The accuracy of the system depends on the performance of the Artificial Intelligence models used for text and image analysis. In some cases, the models may produce false positives or fail to identify highly complex or context-specific privacy risks.
The image analysis module may require significant computational resources when processing high-resolution images or large Vision-Language Models. If the models are deployed remotely, system performance also depends on internet connectivity and server availability, which may increase response time.
Currently, the browser extension is designed for Chromium-based browsers and selected social media platforms. Support for additional browsers and websites will require further development. Despite these limitations, the proposed system provides reliable privacy analysis and establishes a strong foundation for future improvements such as multilingual support, enhanced AI models, OCR integration, and wider browser compatibility.

CHAPTER 6: CONCLUSION AND FUTURE SCOPE

6.1 Conclusion

The proposed Privacy Analyzer for Social Media Platforms was developed to help users identify privacy-sensitive information before sharing content online. By integrating a browser extension with Artificial Intelligence, the system provides real-time analysis of both textual and visual content, enabling users to make informed decisions before publishing their posts.
The implementation combines a Large Language Model (LLM) for text analysis, a Vision-Language Model (VLM) for image analysis, and a Privacy Risk Assessment Engine to generate a unified privacy evaluation. The browser extension captures user content, communicates with the backend through REST APIs, and displays privacy warnings and recommendations in an easy-to-understand format.
The testing and evaluation results demonstrate that the proposed system successfully detects various types of sensitive information, classifies privacy risks, and provides useful recommendations to reduce accidental privacy exposure. The modular architecture also ensures scalability, maintainability, and support for future enhancements.
Overall, the proposed Privacy Analyzer provides an effective and intelligent solution for improving user awareness and protecting personal information while using social media platforms.

6.2 Future Scope

The proposed Privacy Analyzer provides a strong foundation for intelligent privacy protection; however, several enhancements can further improve its capabilities. Future versions of the system can incorporate more advanced Artificial Intelligence models with higher accuracy for detecting complex and context-dependent privacy risks. Fine-tuning the language and vision models on privacy-specific datasets can also improve detection performance.
The system can be extended to support additional web browsers and a wider range of social media platforms. Features such as multilingual privacy analysis, Optical Character Recognition (OCR) for extracting text from images, video content analysis, and voice-based privacy detection can further enhance the effectiveness of the application. Personalized privacy settings and adaptive risk scoring based on user preferences may also provide a more customized experience.
Future development may also focus on improving response time through optimized AI models and edge computing techniques. Integration with cloud-based services, enterprise security platforms, and mobile applications can expand the usability of the Privacy Analyzer beyond social media. These enhancements will make the system more scalable, accurate, and capable of addressing emerging digital privacy challenges.
REFERENCES

[1] S. Russell and P. Norvig, Artificial Intelligence: A Modern Approach, 4th ed. Pearson, 2021.
[2] I. Goodfellow, Y. Bengio, and A. Courville, Deep Learning. MIT Press, 2016.
[3] A. Vaswani et al., "Attention Is All You Need," Advances in Neural Information Processing Systems (NeurIPS), 2017.
[4] T. Brown et al., "Language Models are Few-Shot Learners," Advances in Neural Information Processing Systems (NeurIPS), 2020.
[5] OpenAI, "GPT Models Documentation."
[6] Alibaba Cloud, "Qwen2.5-VL Technical Report and Documentation."
[7] Google Chrome Developers, "Chrome Extensions Documentation."
[8] Mozilla Developer Network (MDN), "WebExtensions API Documentation."
[9] OWASP Foundation, "OWASP Top 10 Web Application Security Risks."
[10] National Institute of Standards and Technology (NIST), "Guide to Protecting the Confidentiality of Personally Identifiable Information (PII)," Special Publication 800-122.
[11] European Union, General Data Protection Regulation (GDPR), Regulation (EU) 2016/679.
[12] A. Krizhevsky, I. Sutskever, and G. Hinton, "ImageNet Classification with Deep Convolutional Neural Networks," NeurIPS, 2012.
[13] Hugging Face, "Transformers Library Documentation."
[14] LM Studio Documentation.
[15] Google Colaboratory Documentation.







APPENDIX
1. LANDING PAGE

1. LOGIN PAGE







1. LOGIN PAGE













