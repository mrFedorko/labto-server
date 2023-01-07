import nodemailer from 'nodemailer'
import config from 'config';



async function verifyEmail(email, verificationKey){

    let verifyUrl
    if(config.get('mode') === 'dev'){
        verifyUrl = `${config.get('server.baseUrl')}/api/verify/${verificationKey}`
    } else {
        verifyUrl = `${config.get('server.host')}/api/verify/${verificationKey}`
    }

    let transporter = nodemailer.createTransport({
        host: "smtp.mail.ru",
        port: 465,
        secure: true,
        auth: {
        user: 'belmint@mail.ru',
        pass: 'LFKfyWkSydJrkJuxVN2X', 
        },
    });

    let info = await transporter.sendMail({
        from: '"Рекламная компания МЯТА" <belmint@mail.ru>', 
        to: email, 
        subject: "Подтверждение регистрации", 
        text: `Для подтверждения регистрации пройдите по ссылке ${config.get('server')['baseUrl']}/api/verify/${verificationKey}`, 
        html: `<section style="padding: 30px;">
                    
                    <div style="background-color: rgb(241, 241, 241); padding: 30px; border-radius: 20px;">
                    <h1 style="margin-bottom: 40px;">Приветствуем!</h1>
                    <p style="font-size: 15px; margin-bottom: 40px;">Недавно Вы создали аакаунт на сервисе для 
                    заказов полиграфии и рекламы "Мята". Для обеспечения конфиденциальности просим Вас подтвердить 
                    адрес электронной почты.</p>
                    <a href = ${config.get('server')['baseUrl']}/api/verify/${verificationKey}>
                    <button style="background-color: rgb(77, 137, 124); padding: 10px; border-radius: 25px; color: white; border: none;">
                    Подтвердить адрес электронной почты</button>
                    </a>
    


                    <p style="font-size: 15px; margin-top: 20px; font-weight: bold;">С уважением, Мята</p>
                    </div>
                    </section>`, 
    });
};

export { verifyEmail }