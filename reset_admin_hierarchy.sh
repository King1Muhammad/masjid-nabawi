#!/bin/bash

echo "Resetting admin hierarchy..."
cd "$(dirname "$0")"

# Execute the TypeScript file to reset the admin hierarchy
npx tsx -e "import { recreateAdminHierarchy } from './server/seed-admins'; recreateAdminHierarchy().then(result => { console.log(result.message); }).catch(error => { console.error('Failed to recreate admin hierarchy:', error); });"

echo "Reset script completed."