import app from './app';
import { config } from './config/config';

// Server instance
app.listen(config.port, () => {
    console.log(`Server is listening on port : ${config.port}`);
})