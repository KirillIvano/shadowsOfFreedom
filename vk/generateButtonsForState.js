const generateButtons = function(state){
    let buttons;
    switch (state){
        case 'init':
            buttons = [
                [
                    {
                        action: {
                            type: 'text',
                            label: 'товар',
                        },
                        color: 'primary'
                    },
                    {
                        action: {
                            type: 'text',
                            label: 'альбом',
                        },
                        color: 'primary'
                    }
                ],
                [
                    // {
                    //     action: {
                    //         type: 'text',
                    //         label: 'ДОБАВИТЬ КОНТАКТ',
                    //     },
                    //     color: 'primary'
                    // },
                    {
                        action: {
                            type: 'text',
                            label: 'новость',
                        },
                        color: 'primary'
                    },
                ]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
            ];
            break;
        case 'good_approve':
        case 'album_approve':
        case 'announce_approve':
            buttons = [
                [
                    {
                        action: {
                            type: 'text',
                            label: 'да',
                        },
                        color: 'positive'
                    },
                    {
                        action: {
                            type: 'text',
                            label: 'нет',
                        },
                        color: 'negative'
                    }
                ]
            ];
            break;
        default:
            buttons = [
                [
                    {
                        action: {
                            type: 'text',
                            label: 'вернуться',
                        },
                        color: 'primary'
                    }
                ]
            ];
    };
    return {
        one_time: false,
        buttons: buttons 
    };
};

module.exports = generateButtons;