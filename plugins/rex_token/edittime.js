﻿function GetPluginSettings()
{
	return {
		"name":			"Token",
		"id":			"Rex_Token",
		"version":		"0.1",   		
		"description":	"Round-robin player index, used in turn based game.",
		"author":		"Rex.Rainbow",
		"help url":		"",
		"category":		"General",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		0
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(1, 0, "First index", "Index", 
             "First index", "Testing if current index is first.", "IsFirst");
AddCondition(2, 0, "Last index", "Index", 
             "Last index", "Testing if current index is the last.", "IsLast");
AddCondition(5, cf_trigger, "On player changing", "Index", 
             "On player changing", 'Triggered when player changing by "Action:Next".', "OnIndexChanging");
                   
//////////////////////////////////////////////////////////////
// Actions          
AddAction(2, 0, "Invert", "Order", 
          "Invert token order", 
          "Invert token order.", "InvertOrder");            
AddAction(3, 0, "Next", "Index", 
          "Turn to next player", 
          "Turn to next player.", "NextIndex");
AddNumberParam("Index", "Player index", 0);
AddAction(4, 0, "Set", "Index", 
          "Set next player index to <i>{0}</i>", 
          "Set next player index.", "SetIndex"); 
AddAction(5, 0, "Turn off", "Index", 
          "Turn off token", 
          "Turn off token.", "TurnOff");                 
AddStringParam("ID", "Player ID string", "1,2");
AddAction(10, 0, "Set ID list", "ID", 
          "Set ID list to [ <i>{0}</i> ]", 
          "Set ID list.", "SetIDList");  
AddAnyTypeParam("ID", "Player ID", 1);
AddAction(11, 0, "Append ID", "ID", 
          "Append <i>{0}</i> to ID list", 
          "Append ID to list.", "AppendIDList");  
AddAnyTypeParam("ID", "Player ID", 1);
AddAction(12, 0, "Remove ID", "ID", 
          "Remove <i>{0}</i> from ID list", 
          "Remove ID from list.", "RemoveIDList");                   
       
//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number,
              "Get list length", "List", "ListLength",
              "Get ID list length.");
AddNumberParam("Index", "Player index.", 0);   
AddExpression(1, ef_return_any | ef_variadic_parameters,
              "Get ID by index", "Look up", "Index2ID",
              "Get player ID by player index.");
AddStringParam("ID", "Player ID.", "1");   
AddExpression(2, ef_return_number | ef_variadic_parameters,
              "Get index by ID", "Look up", "ID2Index",
              "Get player index by player ID.");            
AddExpression(3, ef_return_number, 
              "Get current index", "Index", "CurrIndex", "Get current player index.");
AddExpression(4, ef_return_any, 
              "Get current ID", "ID", "CurrID", "Get current player ID.");
AddExpression(5, ef_return_number, 
              "Get previous index", "Index", "PreIndex", "Get previous player index.");
AddExpression(6, ef_return_any, 
              "Get previous ID", "ID", "PreID", "Get previous player ID.");


ACESDone();

// Property grid properties for this plugin
var property_list = [
    new cr.Property(ept_text, "Player ID list", "1,2", 'Player ID. Seprate by","'),
    new cr.Property(ept_integer, "Initial index", (-1), "Initial index, 0 base. The next index of (-1) is 0."),
    new cr.Property(ept_combo, "Order", "Increasing", "Order of transfering player index.", "Increasing|Decreasing"),
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{ 
    if (this.properties["Initial index"] <(-1))
        this.properties["Initial index"] = (-1);
    else
    {
        var id_cnt = JSON.parse("["+this.properties["Player ID list"]+"]").length;
        if (this.properties["Initial index"] >= id_cnt)
            this.properties["Initial index"] = id_cnt-1;
    }
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
