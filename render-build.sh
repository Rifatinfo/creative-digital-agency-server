set -o errexit

npm run build
npm install 
npx prisma generate
npx prisma migrate deploy