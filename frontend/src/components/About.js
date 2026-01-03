import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>À Propos de l'ATFP</h1>
      
      <div className="about-content">
        <section className="about-section">
          <h2>L'ATFP - L'organisme principal de formation public en Tunisie</h2>
          <p>
            L'ATFP est le plus grand organisme public de formation en Tunisie. Il propose une grande diversité 
            de formations couvrant plusieurs domaines. Un large éventail de formations professionnelles est proposé, 
            avec cent trente-six centres de formation (sectoriels, jeunes filles rurales, apprentissage et métiers 
            de l'artisanat) et plus de quatre cents spécialités disponibles. Pendant la formation, les apprenants 
            bénéficient d'une pédagogie innovante qui combine des formations en alternance et des cours en ligne.
          </p>
          <p>
            L'ATFP est un établissement Public à caractère non Administratif. Elle est créée en 1993 en vertu de : 
            La loi 93-11 du 17 Février 1993. Son organisation administrative et financière ainsi que les modalités 
            de son fonctionnement sont fixées par : Le décret 97-1937 du 29 Septembre 1997.
          </p>
        </section>

        <section className="about-section">
          <h2>Vision de l'ATFP</h2>
          <p>
            L'Agence Tunisienne de la Formation Professionnelle est le principal acteur de la formation professionnelle, 
            levier de développement des ressources humaines, assurant des prestations de qualité répondant aux besoins 
            économiques et sociaux des individus, des entreprises et des régions à l'échelle nationale et internationale.
          </p>
          
          <div className="vision-points">
            <div className="vision-item">
              <h3>Principal acteur de la formation professionnelle</h3>
              <p>L'Agence détient 93 % du système national de formation et intervient principalement dans le secteur industriel.</p>
            </div>
            
            <div className="vision-item">
              <h3>Levier de développement des ressources humaines</h3>
              <p>
                Les centres de l'ATFP formeront un futur employé modèle spécialisé, employable, le jeune apprenant 
                devra être un leader, entrepreneur et donc pourvoyeur d'emploi participera au développement économique du pays.
              </p>
            </div>
            
            <div className="vision-item">
              <h3>Des prestations de qualité</h3>
              <p>
                Nous nous engageons à fournir des formations de haute qualité, en veillant à ce que nos formateurs 
                et nos apprenants répondent aux normes internationales.
              </p>
            </div>
            
            <div className="vision-item">
              <h3>Répondant aux besoins économiques et sociaux</h3>
              <p>
                Nos prestations de formation sont spécifiquement conçues pour répondre aux besoins économiques et 
                sociaux des individus, des entreprises et des régions, tant au niveau national qu'international.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Les Valeurs de l'ATFP</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>L'appartenance</h3>
              <p>
                Les employés, apprenants et formateurs de l'agence éprouvent un fort sentiment d'appartenance. 
                Nous travaillons tous ensemble pour développer et améliorer l'agence.
              </p>
            </div>
            
            <div className="value-card">
              <h3>L'innovation</h3>
              <p>
                Nous encourageons la pensée innovante, en anticipant les changements, en étant en avance sur notre 
                temps et en prévoyant l'avenir.
              </p>
            </div>
            
            <div className="value-card">
              <h3>Excellence</h3>
              <p>
                Nos programmes pédagogiques visent l'excellence. Nous encourageons nos jeunes stagiaires à viser 
                l'excellence dans tous leurs projets.
              </p>
            </div>
            
            <div className="value-card">
              <h3>Redevabilité</h3>
              <p>
                Nous sommes responsables de notre travail envers notre entreprise. Nous sommes responsables de 
                nos résultats et nous nous engageons à être présents pour nos jeunes et pour notre patrie.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Missions de l'ATFP</h2>
          <ul className="missions-list">
            <li>Assurer la formation initiale des jeunes et des adultes compte tenu des besoins économiques et sociaux</li>
            <li>Œuvrer à la satisfaction des demandes de formation de main d'œuvre qualifiée dans le cadre des orientations fixées par l'autorité de tutelle</li>
            <li>Mettre en œuvre les programmes de formation dont la réalisation lui est confiée par l'autorité de tutelle</li>
            <li>Procéder périodiquement à l'évaluation des activités de formation qui se déroulent au sein d'établissements auxiliaires qui relèvent de l'ATFP</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Un réseau de Centres de Formation</h2>
          <div className="centers-grid">
            <div className="center-card">
              <div className="center-number">51</div>
              <p>Centres sectoriels de formation</p>
            </div>
            <div className="center-card">
              <div className="center-number">62</div>
              <p>Centres de formation et d'apprentissage</p>
            </div>
            <div className="center-card">
              <div className="center-number">14</div>
              <p>Centres de formation de la jeune fille rurale</p>
            </div>
            <div className="center-card">
              <div className="center-number">09</div>
              <p>Centres de formation aux métiers de l'artisanat</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Les Modes de Formation</h2>
          <div className="modes-list">
            <div className="mode-item">
              <h3>Résidentiel</h3>
              <p>
                La formation est entièrement dispensée au sein de notre centre, et elle est complétée par un stage 
                d'application d'une durée d'un mois à la fin de chaque année de formation.
              </p>
            </div>
            
            <div className="mode-item">
              <h3>Alternance</h3>
              <p>
                La formation est réalisée à la fois au centre et en entreprise, selon un découpage préalablement 
                établi et concerté qui varie en fonction de la spécialité.
              </p>
            </div>
            
            <div className="mode-item">
              <h3>Apprentissage</h3>
              <p>
                La formation est réalisée à la fois au centre et en entreprise, et elle est régie par un contrat 
                d'apprentissage établi entre l'apprenti et l'entreprise.
              </p>
            </div>
            
            <div className="mode-item">
              <h3>À la carte</h3>
              <p>
                La formation est réalisée par le centre en réponse aux besoins spécifiques exprimés par les entreprises.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section video-section">
          <h2>Découvrez l'ATFP en vidéo</h2>
          <div className="video-container">
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/dy9TZ7InJSo"
              title="ATFP Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
