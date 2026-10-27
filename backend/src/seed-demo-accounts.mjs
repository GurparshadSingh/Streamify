import mongoose from '../node_modules/mongoose/index.js';
import dotenv from '../node_modules/dotenv/lib/main.js';
import { randomBytes } from 'node:crypto';
import { StreamChat } from '../node_modules/stream-chat/dist/index.js';
import User from '../models/User.js';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1') });
const profiles = [
 ['Aarav Sharma','aarav','Web Development','Student','Delhi, India','Demo profile: Engineering student building React apps and looking for project collaborators.'],
 ['Priya Mehta','priya','AI / Machine Learning','Professional','Bengaluru, India','Demo profile: ML engineer interested in practical AI, Python, and sharing project ideas.'],
 ['Kabir Singh','kabir','Mechanical Engineering','Student','Pune, India','Demo profile: Mechanical engineering student exploring CAD, robotics, and team projects.'],
 ['Neha Patel','neha','Cloud / DevOps','Professional','Hyderabad, India','Demo profile: DevOps engineer working with cloud infrastructure, containers, and automation.'],
 ['Rohan Das','rohan','Electronics / Embedded Systems','Student','Kolkata, India','Demo profile: Electronics student building embedded systems and IoT projects.'],
];
try {
 await mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS:15000});
 const client = process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET ? StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET) : null;
 const ids=[];
 for(const [fullName,seed,engineeringDomain,careerStage,location,bio] of profiles){
  const email=`streamify.demo.${seed}@example.com`;
  let user=await User.findOne({email});
  if(!user){user=await User.create({fullName,email,password:randomBytes(32).toString('hex'),engineeringDomain,careerStage,location,bio,isOnboarded:true,profilePic:`https://api.dicebear.com/10.x/lorelei/svg?seed=streamify-demo-${seed}`});}
  ids.push(user._id);
  if(client){await client.upsertUser({id:user._id.toString(),name:user.fullName,image:user.profilePic,engineeringDomain:user.engineeringDomain,careerStage:user.careerStage});}
 }
 const eligible = await User.find({_id:{$in:ids},isOnboarded:true,engineeringDomain:{$exists:true,$ne:''},careerStage:{$in:['Student','Professional']}}).select('fullName engineeringDomain careerStage -_id').lean();
 console.log(JSON.stringify({demoAccounts:ids.length,eligibleForRecommendations:eligible.length,profiles:eligible},null,2));
} catch(error){ console.error('Demo seed failed:',error.name, String(error.message).replace(/mongodb(?:\+srv)?:\/\/[^\s]+/g,'[redacted database address]')); process.exitCode=1; }
finally{await mongoose.disconnect();}
