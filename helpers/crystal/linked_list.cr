require "spec"

# Implementation of [Singly Linked List](https://en.wikipedia.org/wiki/Linked_list#Singly_linked_list)
class LinkedList(V)
  class Node(T)
    getter value : T
    property next : Node(T)?

    def initialize(@value : T, @next = nil)
    end
  end

  include Enumerable(V)

  getter head : Node(V)?
  getter tail : Node(V)?

  def initialize
    @head = nil
    @tail = @head
  end

  def initialize(array : Array(V))
    if array.empty?
      @head = nil
      @tail = @head
    else
      @head = Node.new(array.shift)

      node = @head
      array.each do |value|
        next_node = Node.new(value)
        node.not_nil!.next = next_node
        node = next_node
      end

      @tail = node
    end
  end

  # Enumerable required method
  def each
    return nil if @head.nil?

    node = @head
    while node
      yield node
      node = node.next
    end
  end

  # Checks if list is empty -> O(1)
  def empty? : Bool
    @head.nil? && @tail.nil?
  end

  # Pushes new node value on the end of the list -> O(1)
  def push(value : V) : Nil
    if @head.nil?
      @head = Node.new(value)
      @tail = @head
    else
      node = Node.new(value)
      @tail.not_nil!.next = node
      @tail = node
    end
  end

  # Inserts new node value on specific index -> O(n)
  def insert_at(index : Int32, value : V) : Nil
    if index < 0
      raise "Index must not be a negative integer."
    elsif index == 0 && @head
      @head = Node.new(value, @head)
    else
      prev = nil
      node = @head
      index.times do
        raise "Index [#{index}] out of range." if node.nil? || node.next.nil?
        prev = node
        node = node.next
      end

      prev.not_nil!.next = Node.new(value, node)
    end
  end

  # Deletes existing node on specific index -> O(n)
  def delete_at(index : Int32) : Nil
    if index < 0
      raise "Index must not be a negative integer."
    elsif index == 0 && @head
      @head = @head.not_nil!.next
    else
      prev = nil
      node = @head
      index.times do
        raise "Index [#{index}] out of range." if node.nil? || node.next.nil?
        prev = node
        node = node.next
      end

      prev.not_nil!.next = node.not_nil!.next
      @tail = prev if prev.not_nil!.next.nil?
    end
  end

  # Gets node on specific index -> O(n)
  def get_at(index : Int32) : Node(V)?
    if index < 0
      raise "Index must not be a negative integer."
    else
      node = @head
      index.times do
        raise "Index [#{index}] out of range." if node.nil? || node.next.nil?
        node = node.next
      end

      node
    end
  end

  # Finds node by value -> O(n)
  def find(value : V) : Node(V)?
    node = @head
    while node
      return node if node.value == value
      node = node.next
    end
  end

  # Override display for `puts` IO function
  def to_s(io)
    list = [] of V
    node = @head
    while node
      list << node.value
      node = node.next
    end

    io << "[#{list.join("] -> [")}]"
  end

  # Returns the size of the Linked list
  def size : Int32
    size = 0
    node = @head
    while node
      size += 1
      node = node.next
    end

    size
  end
end

describe LinkedList do
  describe "#new" do
    it "initializes linked list with array" do
      ll = LinkedList.new([1, 2, 3])

      ll.size.should eq(3)
      ll.head.not_nil!.value.should eq(1)
      ll.tail.not_nil!.value.should eq(3)
    end

    it "initializes empty linked list" do
      ll = LinkedList(Int32).new

      ll.size.should eq(0)
      ll.head.should be_nil
      ll.tail.should be_nil
    end
  end

  describe "#empty?" do
    it "returns true if list is empty" do
      ll = LinkedList(Int32).new

      ll.empty?.should be_true
    end

    it "returns false if list is not empty" do
      ll = LinkedList.new([1, 2, 3])

      ll.empty?.should be_false
    end
  end

  describe "#size" do
    it "returns size of the array" do
      (0..3).each do |size|
        ll = LinkedList.new([0] * size)

        ll.size.should eq(size)
      end
    end
  end

  describe "#each" do
    it "enumerates linked list" do
      ll = LinkedList.new([1, 2, 3])

      ll.each { |node| node.value.should be_a(Int32) }
    end
  end

  describe "#get" do
    it "gets specific node by valid index" do
      ll = LinkedList.new([1, 2, 3])

      ll.get_at(0).not_nil!.value.should eq(1)
      ll.get_at(1).not_nil!.value.should eq(2)
      ll.get_at(2).not_nil!.value.should eq(3)
    end

    it "tries to get node by out of range index" do
      ll = LinkedList.new([1, 2, 3])

      expect_raises(Exception, "Index [3] out of range.") { ll.get_at(3) }
    end

    it "tries to get node by negative index" do
      ll = LinkedList.new([1, 2, 3])

      expect_raises(Exception, "Index must not be a negative integer.") do
        ll.get_at(-1)
      end
    end
  end

  describe "#push" do
    it "adds node value to the end of the populated list" do
      ll = LinkedList.new([1, 2, 3])

      ll.push(4)

      ll.size.should eq 4
      ll.get_at(3).not_nil!.value.should eq(4)
      ll.head.not_nil!.value.should eq(1)
      ll.tail.not_nil!.value.should eq(4)
    end

    it "adds node value to the end of the empty list" do
      ll = LinkedList(Int32).new

      ll.push(4)

      ll.size.should eq 1
      ll.get_at(0).not_nil!.value.should eq(4)
      ll.head.not_nil!.value.should eq(4)
      ll.tail.not_nil!.value.should eq(4)
    end
  end

  describe "#insert_at" do
    it "inserts new node at begining of the list" do
      ll = LinkedList.new([1, 2, 3])

      ll.insert_at(0, 4)

      ll.size.should eq 4
      ll.get_at(0).not_nil!.value.should eq(4)
      ll.head.not_nil!.value.should eq(4)
      ll.tail.not_nil!.value.should eq(3)
    end

    it "inserts new node in the middle of the list" do
      ll = LinkedList.new([1, 2, 3])

      ll.insert_at(1, 4)

      ll.size.should eq 4
      ll.get_at(1).not_nil!.value.should eq(4)
      ll.head.not_nil!.value.should eq(1)
      ll.tail.not_nil!.value.should eq(3)
    end

    it "inserts new node in the end of the list" do
      ll = LinkedList.new([1, 2, 3])

      ll.insert_at(2, 4)

      ll.size.should eq 4
      ll.get_at(2).not_nil!.value.should eq(4)
      ll.head.not_nil!.value.should eq(1)
      ll.tail.not_nil!.value.should eq(3)
    end

    it "tries to insert node by out of range index" do
      ll = LinkedList.new([1, 2, 3])

      expect_raises(Exception, "Index [3] out of range.") { ll.insert_at(3, 4) }
    end

    it "tries to insert node on negative index" do
      ll = LinkedList.new([1, 2, 3])

      expect_raises(Exception, "Index must not be a negative integer.") do
        ll.get_at(-1)
      end
    end
  end

  describe "#delete_at" do
    it "deletes node at begining of the list" do
      ll = LinkedList.new([1, 2, 3])

      ll.delete_at(0)

      ll.size.should eq 2
      ll.get_at(0).not_nil!.value.should eq(2)
      ll.head.not_nil!.value.should eq(2)
      ll.tail.not_nil!.value.should eq(3)
    end

    it "deletes node in the middle of the list" do
      ll = LinkedList.new([1, 2, 3])

      ll.delete_at(1)

      ll.size.should eq 2
      ll.get_at(1).not_nil!.value.should eq(3)
      ll.head.not_nil!.value.should eq(1)
      ll.tail.not_nil!.value.should eq(3)
    end

    it "deletes node at the end of the list" do
      ll = LinkedList.new([1, 2, 3])

      ll.delete_at(2)

      ll.size.should eq 2
      ll.get_at(1).not_nil!.value.should eq(2)
      ll.head.not_nil!.value.should eq(1)
      ll.tail.not_nil!.value.should eq(2)
    end

    it "tries to insert node by out of range index" do
      ll = LinkedList.new([1, 2, 3])

      expect_raises(Exception, "Index [3] out of range.") { ll.delete_at(3) }
    end

    it "tries to delete node on negative index" do
      ll = LinkedList.new([1, 2, 3])

      expect_raises(Exception, "Index must not be a negative integer.") do
        ll.get_at(-1)
      end
    end
  end
end
