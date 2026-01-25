import './CommunityGuidelines.css';

const CommunityGuidelines = () => {
    return (
        <div className="guidelines-container">
            <div className="guidelines-card">
                <h1>Community Guidelines</h1>
                <p className="subtitle">Please read these guidelines to ensure a safe and respectful environment for everyone.</p>
                
                <section className="guidelines-section">
                    <h2>1. Respect Privacy</h2>
                    <p>Do not post personal information about yourself or others, including names, addresses, phone numbers, or social media handles. Keep it anonymous.</p>
                </section>

                <section className="guidelines-section">
                    <h2>2. No Hate Speech</h2>
                    <p>We do not tolerate hate speech, harassment, or discrimination based on race, religion, gender, sexual orientation, disability, or nationality.</p>
                </section>

                <section className="guidelines-section">
                    <h2>3. Be Kind</h2>
                    <p>Even though you are anonymous, please be mindful of the impact your words can have. Avoid bullying or malicious intent.</p>
                </section>

                <section className="guidelines-section">
                    <h2>4. Content Moderation</h2>
                    <p>All confessions are subject to review. Content that violates our guidelines or contains illegal material will be removed immediately.</p>
                </section>

                <section className="guidelines-section">
                    <h2>5. Safety First</h2>
                    <p>If you are in a crisis or need help, please reach out to professional services. This platform is for sharing thoughts, not for emergency support.</p>
                </section>

                <div className="back-link">
                    <button onClick={() => window.history.back()}>Go Back</button>
                </div>
            </div>
        </div>
    );
};

export default CommunityGuidelines;