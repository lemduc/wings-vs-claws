// Author block — who's behind the content (credibility signal for a security site).
export default function About() {
  return (
    <section id="about">
      <div className="about term">
        <div className="term-bar">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
          <span className="fname">whoami</span>
        </div>
        <div className="term-body">
          <p className="about-line">
            <span className="prompt" />built by <b>Duc Minh Le, PhD</b> — identity &amp; access
            management engineer. Before IAM: software-architecture researcher (PhD, USC;
            ICSA 2018 Best Paper).
          </p>
          <p className="about-why">
            Why this site: AI agents are the newest non-human identities, and the two most
            popular open-source ones answer the IAM question in opposite ways. Documenting
            that difference turned into a place to learn IAM end-to-end.
          </p>
          <div className="about-links">
            <a href="https://lemduc.github.io" target="_blank" rel="noreferrer">lemduc.github.io ↗</a>
            <a href="https://github.com/lemduc/wings-vs-claws" target="_blank" rel="noreferrer">source ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}
