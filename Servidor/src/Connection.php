<?php

	class Connection
	{
		var $host;
		var $user;
		var $password;
		var $database;
		var $link = 0;
		var $result = FALSE;

		function __construct($host, $user, $password, $database)
		{
			$this->host = $host;
			$this->user = $user;
			$this->password = $password;
			$this->database = $database;

			$this->link = mysqli_connect($host, $user, $password, $database);
			$this->setCharSet("utf8");
		}

		function getLink()
		{
			return $this->link;
		}

		function getResult()
		{
			return $this->result;
		}

		function errorMessage()
		{
			print("Um erro ocorreu!".PHP_EOL);
			print(mysqli_error($this->getLink()).PHP_EOL);
			print("Código do erro: ".PHP_EOL);
			print(mysqli_errno($this->getLink()).PHP_EOL);
		}

    function getErrorCode()
    {
      return $this->getResult() == FALSE ? mysqli_errno($this->getLink()) : -1;
    }

		function fetch_row()
		{
			return mysqli_fetch_row($this->getResult());
		}

		function num_rows()
		{
			return mysqli_num_rows($this->getResult());
		}

		function fetch_assoc()
		{
			return mysqli_fetch_assoc($this->getResult());
		}

		function query($sql)
		{
			$this->result = mysqli_query($this->getLink(), $sql);

			if($this->getResult() == FALSE)
			{
				print($this->errorMessage());
			}
		}

		function queryAssocArray($sql)
		{
			$ret = array();
	    $this->query($sql);
	    while($row = $this->fetch_assoc())
	    {
	      $ret[] = $row;
	    }
	    mysqli_free_result($this->getResult());
	    return $ret;
		}

		function querySingleAssocArray($sql)
		{
			$ret = null;
	    $this->query($sql);
			if(mysqli_num_rows($this->getResult()) > 0)
			{
		    $row = $this->fetch_assoc();
	      $ret = $row;
			}
	    mysqli_free_result($this->getResult());
	    return $ret;
		}

		function queryColumnArray($sql, $column)
		{
			$ret = array();
	    $this->query($sql);
	    while($row = $this->fetch_assoc())
	    {
	      $ret[] = $row[$column];
	    }
	    mysqli_free_result($this->getResult());
	    return $ret;
		}

		function setCharSet($charset)
		{
			mysqli_set_charset($this->getLink(), $charset);
		}
	}
?>
