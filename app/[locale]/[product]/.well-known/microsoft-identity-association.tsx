import React from 'react';

const MicrosoftIdentityAssociation: React.FC = () => {
    const json = {
        name: 'GitHub Copilot',
        version: '1.0.0',
        description: 'AI programming assistant',
    };

    return <pre>{JSON.stringify(json, null, 2)}</pre>;
};

export default MicrosoftIdentityAssociation;
