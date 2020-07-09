import React,{useState} from 'react';
import {DragDropContext,Droppable, Draggable} from 'react-beautiful-dnd';
import {v4 as uuid} from 'uuid';
import './style.css';
const itemsFromBackend = [
  {id:uuid(),content:"First Task"},
  {id:uuid(),content:"Second Task"}
];

const columnsFromBackend = {
  [uuid()]:{
    name :  'Requestd',
    items:itemsFromBackend
  },
  [uuid()]:{
    name:'In Progress',
    items:[]
  },
  [uuid()]:{
    name:'Under Review',
    items:[]
  },
  [uuid()]:{
    name:'Completed',
    items:[]
  }
}

const onDragEnd=(result,columns,setColumns)=>{
  if(!result.destination)return;
  const {source,destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [sourceRemoved] = sourceItems.splice(source.index,1);
    destItems.splice(destination.index,0,sourceRemoved);
    setColumns({
      ...columns,
      [source.droppableId]:{
        ...sourceColumn,
        items:sourceItems
      },
      [destination.droppableId]:{
        ...destColumn,
        items:destItems
      }
    })
  }else{
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index,1);
    copiedItems.splice(destination.index,0,removed);
    setColumns({
      ...columns,
      [source.droppableId]:{
        ...column,
        items:copiedItems
      }
    })

  }



}


function App() {
  const [columns,setColumns] = useState(columnsFromBackend);
  return (
    <div className="App">
      <DragDropContext onDragEnd={result=>onDragEnd(result,columns,setColumns)}>
          {
            Object.entries(columns).map(([id,column])=>{
              return(
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <h2>{column.name}</h2>
                <div style={{margin:8}}>
                <Droppable droppableId={id} key={id} >
                  {
                    (provided,snapshot)=>{
                      return(
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                            background:snapshot.isDraggingOver?'lightblue':'lightgrey',
                            padding:4,
                            width:240,
                            minHeight:500
                          }}
                          >
                          {
                            column.items.map((item,index)=>{
                              return(
                                <Draggable draggableId={item.id} key={item.id} index={index} >
                                  {
                                    (provided,snapshot)=>{
                                      return(
                                        <div 
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        style={{
                                          userSelect:'none',
                                          padding: 16,
                                          margin:'0 0 8px 0',
                                          minHeight:'50px',
                                          backgroundColor:snapshot.isDragging?'#263B4A':'#456C86',
                                          color:'white',
                                          ...provided.draggableProps.style
                                        }}  
                                         >
                                          {item.content}
                                        </div>
                                      )
                                    }
                                  }
                                </Draggable>
                              )
                            })
                          }
                        </div>
                      )
                    }
                  }
              </Droppable>
              </div>
              </div>
              )
            })
          }
      </DragDropContext>
    </div>
  );
}

export default App;
