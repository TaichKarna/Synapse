import { useGetContactsQuery } from "../rtk-query/apiSlice"
import { Plus } from "lucide-react"; 
import { SearchBar } from "../components/Inputs";
import { MainContainer, TopHeaderContainer } from "../components/TopHeader"
import { ContactCard } from "../components/Cards";

export default function Chats(){
   const {data: contacts, isFetching, isLoading} = useGetContactsQuery();
   console.log(contacts);

   return(
    <div className="w-full">
      <TopHeaderContainer>
         <h3 className="subheading-1">Contacts</h3>
         <Plus className="h-5"/>
      </TopHeaderContainer>
      <MainContainer>
               <SearchBar/>
               {
                  contacts.map( contact => (
                    <div className="pb-2 border-b-[1.5px] border-b-neutralLine">
                        <ContactCard name={contact.name} profilePic={contact.profilePic} subInfo={contact.lastSeen} key={contact.id}/>
                    </div>
                  ))
               }
      </MainContainer>
    </div>
   ) 
}


